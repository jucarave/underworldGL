function MapManager(game, map){
	this.map = null;
	
	this.waterTiles = [];
	this.waterFrame = 0;
	
	this.game = game;
	this.player = null;
	this.instances = [];
	this.orderInstances = [];
	this.doors = [];
	
	this.mapToDraw = [];
	
	if (map == "test"){
		this.loadMap("testMap");
	}
}

MapManager.prototype.loadMap = function(mapName){
	var mapM = this;
	var http = getHttp();
	http.open('GET', 'maps/' + mapName + ".json", true);
	http.onreadystatechange = function() {
  		if (http.readyState == 4 && http.status == 200) {
  			try{
				mapData = JSON.parse(http.responseText);
				
				new MapAssembler(mapM, mapData, mapM.game.GL.ctx);
				
				mapM.map = mapData.map;
				
				mapM.waterTiles = [101];
				mapM.getInstancesToDraw();
			}catch (e){
				console.log(e.message);
				mapM.map = null;
			}
			
		}
	};
	http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	http.send();
};

MapManager.prototype.isWaterTile = function(tileId){
	return (this.waterTiles.indexOf(tileId) != -1);
};

MapManager.prototype.isWaterPosition = function(x, z){
	x = x << 0;
	z = z << 0;
	if (!this.map[z]) return 0;
	if (this.map[z][x] === undefined) return 0;
	else if (this.map[z][x] === 0) return 0;
	
	var t = this.map[z][x];
	if (!t.f) return false;
	
	return this.isWaterTile(t.f);
};

MapManager.prototype.changeWallTexture = function(x, z, textureId){
	if (!this.map[z]) return false;
	if (this.map[z][x] === undefined) return false;
	else if (this.map[z][x] === 0) return false;
	
	var base = this.map[z][x];
	if (!base.cloned){
		var newW = {};
		for (var i in base){
			newW[i] = base[i];
		}
		newW.cloned = true;
		this.map[z][x] = newW;
		base = newW;
	}
	
	base.w = textureId;
};

MapManager.prototype.getDoorAt = function(x, y, z){
	for (var i=0,len=this.doors.length;i<len;i++){
		var door = this.doors[i];
		if (door.wallPosition.equals(x, y, z)) return door;
	}
	
	return null;
};

MapManager.prototype.getInstanceAt = function(position){
	for (var i=0,len=this.instances.length;i<len;i++){
		if (this.instances[i].position.equals(position)){
			return this.instances[i];
		}
	}
	
	return null;
};

MapManager.prototype.getInstanceNormal = function(pos, spd){
	var p = pos.clone();
	p.a = ((p.a + spd.a) << 0);
	p.b = (p.b);
	p.c = ((p.c + spd.b) << 0);
	
	var ins = this.getInstanceAt(p);
	if (!ins) return null;
	
	if (pos.a > ins.position.a + 1) return ObjectFactory.normals.right; else
	if (pos.a < ins.position.a) return ObjectFactory.normals.left; else
	if (pos.c < ins.position.c) return ObjectFactory.normals.up; else
	if (pos.c > ins.position.c + 1) return ObjectFactory.normals.down;
};

MapManager.prototype.wallHasNormal = function(x, y, normal){
	var t1 = this.map[y][x];
	switch (normal){
		case 'u': y -= 1; break;
		case 'l': x -= 1; break;
		case 'd': y += 1; break;
		case 'r': x += 1; break;
	}
	
	if (!this.map[y]) return true;
	if (this.map[y][x] === undefined) return true;
	if (this.map[y][x] === 0) return true;
	var t2 = this.map[y][x];
	
	if (!t2.w) return true;
	if (t2.w && !(t2.y == t1.y && t2.h == t1.h)){
		return true;
	}
	
	return false;
};

MapManager.prototype.getDoorNormal = function(pos, spd, h, inWater){
	var xx = ((pos.a + spd.a) << 0);
	var zz = ((pos.c + spd.b) << 0);
	var y = pos.b;
	
	var door = this.getDoorAt(xx, y, zz);
	if (door){
		var xxx = (pos.a + spd.a) - xx;
		var zzz = (pos.c + spd.b) - zz;
		
		var x = (pos.a - xx);
		var z = (pos.c - zz);
		if (door.dir == "V"){
			if (door && door.isSolid()) return ObjectFactory.normals.left;
			if (zzz > 0.25 && zzz < 0.75) return null;
			if (x < 0 || x > 1) return ObjectFactory.normals.left;
			else return ObjectFactory.normals.up;
		}else{
			if (door && door.isSolid()) return ObjectFactory.normals.up;
			if (xxx > 0.25 && xxx < 0.75) return null;
			if (z < 0 || z > 1) return ObjectFactory.normals.up;
			else return ObjectFactory.normals.left;
		}
	}
};

MapManager.prototype.getWallNormal = function(pos, spd, h, inWater){
	var xx = ((pos.a + spd.a) << 0);
	var zz = ((pos.c + spd.b) << 0);
	
	var t, th;
	var y = pos.b;
	
	if (!this.map[zz]) return null;
	if (this.map[zz][xx] === undefined) return null;
	if (this.map[zz][xx] === 0) return null;
	
	t = this.map[zz][xx];
	th = t.h - 0.3;
	if (inWater) y += 0.3;
	if (t.sl) th += 0.2;
	
	if (!t.w && !t.dw && !t.wd) return null;
	if (t.y+th <= y) return null;
	else if (t.y > y + h) return null;
	
	if (!t) return null;
	if (t.w){
		var tex = this.game.getTextureById(t.w, "wall");
		if (tex.isSolid){
			var xxx = pos.a - xx;
			var zzz = pos.c - zz;
			if (this.wallHasNormal(xx, zz, 'u') && zzz <= 0){ return ObjectFactory.normals.up; }
			if (this.wallHasNormal(xx, zz, 'd') && zzz >= 1){ return ObjectFactory.normals.down; }
			if (this.wallHasNormal(xx, zz, 'l') && xxx <= 0){ return ObjectFactory.normals.left; }
			if (this.wallHasNormal(xx, zz, 'r') && xxx >= 1){ return ObjectFactory.normals.right; }
		}
	}else if (t.dw){
		var x, z, xxx, zzz, normal;
		x = pos.a + spd.a;
		z = pos.c + spd.b;
		
		if (t.aw == 0){ xxx = (xx + 1) - x; zzz =  z - zz; normal = ObjectFactory.normals.upLeft; }
		else if (t.aw == 1){ xxx = x - xx; zzz =  z - zz; normal = ObjectFactory.normals.upRight; }
		else if (t.aw == 2){ xxx = x - xx; zzz =  (zz + 1) - z; normal = ObjectFactory.normals.downRight; }
		else if (t.aw == 3){ xxx = (xx + 1) - x; zzz =  (zz + 1) - z; normal = ObjectFactory.normals.downLeft; }
		if (zzz >= xxx){
			return normal;
		}
	}
	
	return null;
};

MapManager.prototype.getYFloor = function(x, y){
	var xx = x - (x << 0);
	var yy = y - (y << 0);
	x = x << 0;
	y = y << 0;
	if (!this.map[y]) return 0;
	if (this.map[y][x] === undefined) return 0;
	else if (this.map[y][x] === 0) return 0;
	
	var t = this.map[y][x];
	var tt = t.y;
	
	if (t.w) tt += t.h;
	if (t.fy) tt = t.fy;
	
	if (this.isWaterTile(t.f)) tt -= 0.3;
	
	if (t.sl){
		if (t.dir == 0) tt += yy * 0.5; else
		if (t.dir == 1) tt += xx * 0.5; else
		if (t.dir == 2) tt += (1.0 - yy) * 0.5; else
		if (t.dir == 3) tt += (1.0 - xx) * 0.5;
	}
	
	return tt;
};

MapManager.prototype.drawMap = function(){
	var x, y;
	x = this.player.position.a;
	y = this.player.position.c;
	
	for (var i=0,len=this.mapToDraw.length;i<len;i++){
		var mtd = this.mapToDraw[i];
		
		if (x < mtd.boundaries[0] || x > mtd.boundaries[2] || y < mtd.boundaries[1] || y > mtd.boundaries[3])
			continue;
		
		if (mtd.type == "B"){ // Blocks
			this.game.drawBlock(mtd, mtd.texInd);
		}else if (mtd.type == "A"){ // Angled Walls
			this.game.drawAngledWall(mtd, mtd.texInd);
		}else if (mtd.type == "F"){ // Floors
			var tt = mtd.texInd;
			if (this.isWaterTile(tt)){ 
				tt = (mtd.rTexInd) + (this.waterFrame << 0);
				this.game.drawFloor(mtd, tt, 'water');
			}else{
				this.game.drawFloor(mtd, tt, 'floor');
			}
		}else if (mtd.type == "C"){ // Ceils
			var tt = mtd.texInd;
			this.game.drawFloor(mtd, tt, 'ceil');
		}else if (mtd.type == "S"){ // Slope
			this.game.drawSlope(mtd, mtd.texInd);
		}
	}
	
	/*var x1, x2, y1, y2;
	
	var vec = this.getCameraViewBlocks();
	x1 = vec.a; x2 = vec.c;
	y1 = vec.b; y2 = vec.d;
	
	if (x1 < 0) x1 = 0;
	if (x2 >= this.map[0].length) x2 = this.map[0].length;
	
	if (y1 < 0) y1 = 0;
	if (y2 >= this.map.length) y2 = this.map.length;
	
	for (var i=y1;i<y2;i++){
		for (var j=x1;j<x2;j++){
			var t = this.map[i][j];
			if (t === 0) continue;
			
			var fy = t.y;
			var cy = t.y + t.h;
			
			// Draw wall
			if (t.w > 0){ 
				this.game.drawBlock(j, fy, i, t.w, t.object);
				
				fy = fy + t.h;
				cy = cy + t.h;
			}else if (t.dw > 0){
				// Draw angled 
				this.game.drawAngledWall(j, fy, i, t.dw, t.aw, t.object);
			}else if (t.wd > 0){
				// Wall Door 
				for (var wy=fy;wy<cy;wy++){ 
					if (wy == fy)
						this.game.drawDoorWall(j, wy, i, t.wd, t.ver);
					else 
						this.game.drawDoorCube(j, wy, i, t.wd, t.ver);
				}
			}
			
			if (t.fy) fy = t.fy;
			// Draw Slope
			if (t.sl){
				this.game.drawSlope(j, fy, i, t.sl, t.dir);
			}
			
			// Draw floor
			if (t.f){
				var tt = t.f;
				if (this.isWaterTile(tt)){ 
					tt = (t.rf) + (this.waterFrame << 0);
					this.game.drawFloor(j, 0.0 + fy, i, tt, 'water');
				}else{
					this.game.drawFloor(j, 0.0 + fy, i, tt, 'floor');
				}
			}
			
			// Draw ceil
			if (t.c){
				if (t.ch) cy = t.ch;
				var tt = t.c;
				this.game.drawFloor(j, 0.0 + cy, i, tt, 'ceil');
			}
		}
	}*/
};

MapManager.prototype.getPlayerItem = function(itemCode){
	var inv = this.game.inventory.items;
	for (var i=0,len=inv.length;i<len;i++){
		if (inv[i].code == itemCode){
			return inv[i];
		}
	}
	
	return null;
};

MapManager.prototype.removePlayerItem = function(itemCode, amount){
	var inv = this.game.inventory.items;
	for (var i=0,len=inv.length;i<len;i++){
		var it = inv[i];
		if (it.code == itemCode){
			if (--it.amount == 0){
				inv.splice(i,1);
			}
		}
	}
};

MapManager.prototype.addMessage = function(text){
	this.game.console.addSFMessage(text);
};

MapManager.prototype.step = function(){
	this.waterFrame += 0.1;
	if (this.waterFrame >= 2) this.waterFrame = 0;
};

MapManager.prototype.getInstancesToDraw = function(){
	this.orderInstances = [];
	for (var i=0,len=this.instances.length;i<len;i++){
		var ins = this.instances[i];
		
		var xx = Math.abs(ins.position.a - (this.player.position.a - 0.5));
		var zz = Math.abs(ins.position.c - (this.player.position.c - 0.5));
		
		if (xx > 6 || zz > 6) continue;
		
		var dist = xx * xx + zz * zz;
		var added = false;
		for (var j=0,jlen=this.orderInstances.length;j<jlen;j++){
			if (dist >= this.orderInstances[j].dist){
				this.orderInstances.splice(j,0,{ins: ins, dist: dist});
				added = true;
				j = jlen;
			}
		}
		
		if (!added){
			this.orderInstances.push({ins: ins, dist: dist});
		}
	}
};

MapManager.prototype.getInstancesAt = function(x, z){
	var ret = [];
	for (var i=0,len=this.doors.length;i<len;i++){
		var ins = this.doors[i];
		
		if (!ins) continue;
		
		if (Math.round(ins.position.a) == x && Math.round(ins.position.c) == z)
			ret.push(ins);
	}
	
	return ret;
};

MapManager.prototype.raycastCursorObject = function(){
	var mouse_p = this.game.mouse;
	var viewport_p = vec2(mouse_p.a - 24, mouse_p.b - 36);
	var size = vec2(192, 128);
	
	if (viewport_p.a < 0 || viewport_p.b < 0 || viewport_p.a > size.a || viewport_p.b > size.b) return;
	
	var viewport_x = Math.degToRad((viewport_p.a - size.a / 2) / size.a * 70);
	
	var ray_pos = this.player.position;
	var ray_dir = this.player.rotation.b - viewport_x;
	
	var ray = {
		x1: ray_pos.a,
		y1: ray_pos.c,
		x2: ray_pos.a + Math.cos(ray_dir) * 1,
		y2: ray_pos.c - Math.sin(ray_dir) * 1
	};
	
	var instances = this.getInstancesAt((ray.x2) << 0, (ray.y2) << 0);
	for (var i=0,len=instances.length;i<len;i++){
		var ins = instances[i];
		var bBox = ins.getBoundingBox();
		
		if (this.game.lineBoxCollision(ray, bBox)){
			ins.activate();
		}
	}
};

MapManager.prototype.loop = function(){
	if (this.map == null) return;
	
	if (this.game.getMouseButtonPressed()){
		this.raycastCursorObject();
	}
	
	this.step();
	
	this.drawMap();
	
	if (this.player.moved){ this.getInstancesToDraw(); }
	
	for (var i=0,len=this.orderInstances.length;i<len;i++){
		var ins = this.orderInstances[i];
		
		if (!ins) continue;
		ins = ins.ins;
		
		if (ins.destroyed){
			this.orderInstances.splice(i--,1);
			continue;
		}
		
		ins.loop();
	}
	
	for (var i=0,len=this.doors.length;i<len;i++){
		var ins = this.doors[i];
		
		if (!ins) continue;
		var xx = Math.abs(ins.position.a - this.player.position.a);
		var zz = Math.abs(ins.position.c - this.player.position.c);
		
		if (xx > 6 || zz > 6) continue;
		
		if (ins.destroyed){
			this.doors.splice(i--,1);
			continue;
		}
		
		ins.loop();
		this.game.drawDoor(ins.position.a, ins.position.b, ins.position.c, ins.rotation, ins.textureCode);
		this.game.drawDoorWall(ins.doorPosition.a, ins.doorPosition.b, ins.doorPosition.c, ins.wallTexture, (ins.dir == "V"));
	}
	
	this.player.loop();
};
