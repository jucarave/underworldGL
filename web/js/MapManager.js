function MapManager(game, map){
	this.map = null;
	
	this.waterTiles = [];
	this.waterFrame = 0;
	
	this.game = game;
	this.player = null;
	this.instances = [];
	this.orderInstances = [];
	this.doors = [];
	
	if (map == "test"){
		this.createTestMap();
	}
}

MapManager.prototype.createTestMap = function(){
	var A, B, C, D, E, F, G, H, M, N, O, P, Q, R, S;
	// Walls
	A = {w: 3, y: -1, h: 3};
	B = {w: 3, y: 0, h: 2};
	C = {w: 3, y: -1, h: 1, c: 7, f: 4, ch: 2};
	D = {w: 1, y: 0, h: 2};
	E = {w: 1, y: -1, h: 1, c: 7, f: 1, ch: 2};
	F = {w: 1, y: -1, h: 3};
	G = {w: 2, y: -1, h: 1, c: 2, f: 2, ch: 2};
	H = {w: 2, y: 0, h: 2};
	M = {dw: 3, aw: 1, y: 0, h: 2, f: 4, c: 7};
	
	N = {dw: 1, aw: 0, y: 0, h: 2, f: 1, c: 7};
	O = {dw: 1, aw: 1, y: 0, h: 2, f: 1, c: 7};
	P = {dw: 1, aw: 2, y: 0, h: 2, f: 1, c: 7};
	Q = {dw: 1, aw: 3, y: 0, h: 2, f: 1, c: 7};
	
	R = {wd: 3, f: 4, c: 7, y: 0, h: 2, ch: 2, ver: 0};
	S = {wd: 1, f: 1, c: 7, y: 0, h: 2, ch: 2, ver: 1};
	
	var I, J, K, L;
	// Floors
	I = {f: 5, c: 7, y: -0.3, h: 2.3};
	J = {f: 4, c: 7, y: 0, h: 2};
	K = {f: 1, c: 7, y: 0, h: 2};
	L = {f: 2, c: 2, y: 0, h: 2};
	
	this.map = [
		[0,0,0,0,A,A,A,A,A,A,A,0,0,0,0,0,0,0],
		[0,0,0,0,A,I,C,C,C,I,A,0,0,0,0,0,0,0],
		[0,0,0,0,A,I,I,C,I,I,A,0,0,0,0,0,0,0],
		[0,0,0,0,A,I,I,C,I,I,A,0,0,0,0,0,0,0],
		[0,0,0,0,A,I,I,C,I,I,A,0,0,0,0,0,0,0],
		[0,0,0,0,A,I,I,C,I,I,A,0,0,0,0,0,0,0],
		[0,0,0,0,A,A,A,J,A,A,A,0,0,0,D,D,D,0],
		[0,0,0,0,0,0,B,J,B,0,0,0,0,D,D,K,D,0],
		[0,0,0,0,0,0,B,J,B,0,0,0,D,D,K,K,D,D],
		[0,0,0,0,0,0,B,J,B,B,B,B,D,K,K,K,K,D],
		[0,0,0,0,0,0,B,M,J,J,J,J,S,K,N,O,K,D],
		[0,0,0,0,0,0,B,B,B,B,R,B,D,K,Q,P,K,D],
		[0,0,0,0,0,0,0,0,0,B,J,B,D,K,K,K,K,D],
		[0,0,0,0,0,0,0,0,0,B,J,B,D,D,D,D,D,D],
		[0,0,0,0,0,0,D,D,D,B,J,B,D,D,D,0,0,0],
		[0,0,0,0,0,0,D,E,E,E,E,E,E,E,D,0,0,0],
		[0,0,F,F,F,F,F,I,I,I,I,I,I,I,F,0,0,0],
		[0,0,F,I,I,I,I,I,I,I,I,I,I,I,F,0,0,0],
		[H,H,F,G,F,F,F,I,I,I,I,I,I,I,F,0,0,0],
		[H,L,L,L,H,H,D,E,E,E,E,E,E,E,D,0,0,0],
		[H,L,L,L,L,H,D,D,D,D,D,D,D,D,D,0,0,0],
		[H,L,L,L,L,H,0,0,0,0,0,0,0,0,0,0,0,0],
		[H,H,H,H,H,H,0,0,0,0,0,0,0,0,0,0,0,0]
	];
	
	this.waterTiles = [5];
	this.player = new Player(vec3(7.5, 0.0, 2.5), vec3(0.0, Math.PI3_2, 0.0), this);
	
	this.doors.push(new Door(vec3(10.0, 0.0, 11.0), "H", "door1"));
	this.doors.push(new Door(vec3(12.0, 0.0, 10.0), "V", "door1"));
	
	this.instances.push(new Billboard(vec3(6.0,0.0,1.0), "lamp1", this, {nf: 3, cb: vec3(0.5,1.0,0.0), ac: ["cf_1,2,0"]}));
	this.instances.push(new Billboard(vec3(8.0,0.0,1.0), "lamp1", this, {nf: 3, is: 1/3, cb: vec3(0.5,1.0,0.0), ac: ["ct_lamp1Off","nf_1"]}));
	
	this.getInstancesToDraw();
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
	p.sum(spd);
	p.a = (p.a << 0);
	p.b = (p.b << 0);
	p.c = (p.c << 0);
	
	var ins = this.getInstanceAt(p);
	if (!ins) return null;
	
	if (pos.a > ins.position.a + 1) return ObjectFactory.normals.right; else
	if (pos.a < ins.position.a) return ObjectFactory.normals.left; else
	if (pos.c < ins.position.c) return ObjectFactory.normals.up; else
	if (pos.c > ins.position.c) return ObjectFactory.normals.down;
};

MapManager.prototype.getWallNormal = function(pos, spd, h, inWater){
	var xx = ((pos.a + spd.a) << 0);
	var zz = ((pos.c + spd.b) << 0);
	var y = pos.b;
	
	if (!this.map[zz]) return null;
	if (this.map[zz][xx] === undefined) return null;
	if (this.map[zz][xx] === 0) return null;
	var t = this.map[zz][xx];
	
	var th = t.h - 0.3;
	if (inWater) y += 0.3;
	
	if (!t.w && !t.dw && !t.wd) return null;
	if (t.y+th <= y) return null;
	else if (t.y > y + h) return null;
	
	if (t.w){
		var tex = this.game.getTextureById(t.w);
		if (tex.isSolid){
			var xxx = pos.a - xx;
			var zzz = pos.c - zz;
			if (zzz <= 0){ return ObjectFactory.normals.up; }else
			if (zzz >= 1){ return ObjectFactory.normals.down; }else
			if (xxx <= 0){ return ObjectFactory.normals.left; }else
			if (xxx >= 1){ return ObjectFactory.normals.right; }
		}
	}else if (t.dw){
		var x, z, xxx, zzz, normal;
		x = pos.a + spd.a;
		z = pos.c + spd.b;
		
		if (t.aw == 0){ xxx = (xx + 1) - x; zzz =  z - zz; normal = ObjectFactory.normals.upLeft; }
		else if (t.aw == 1){ xxx = x - xx; zzz =  z - zz; normal = ObjectFactory.normals.upRight; }
		else if (t.aw == 2){ xxx = x - xx; zzz =  (zz + 1) - z; normal = ObjectFactory.normals.downRight; }
		else if (t.aw == 3){ xxx = (xx + 1) - x; zzz =  (zz + 1) - z; normal = ObjectFactory.normals.downLeft; }
		if (zzz + 0.2 >= xxx){
			return normal;
		}
	}else if (t.wd){
		var door = this.getDoorAt(xx, t.y, zz);
		var xxx = (pos.a + spd.a) - xx;
		var zzz = (pos.c + spd.b) - zz;
		
		var x = (pos.a - xx);
		var z = (pos.c - zz);
		if (t.ver){
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
	
	return null;
};

MapManager.prototype.getYFloor = function(x, y){
	x = x << 0;
	y = y << 0;
	if (!this.map[y]) return 0;
	if (this.map[y][x] === undefined) return 0;
	else if (this.map[y][x] === 0) return 0;
	
	var t = this.map[y][x];
	var tt = t.y;
	
	if (t.w) tt += t.h;
	if (this.isWaterTile(t.f)) tt -= 0.3;
	
	return tt;
};

MapManager.prototype.getCameraViewBlocks = function(){
	var x1, x2, y1, y2, p, ang;
	
	x1 = x2 = y1 = y2 = 0;
	p = this.player;
	ang = Math.radToDeg(p.rotation.b);
	
	if (ang >= 315 || ang < 45){
		x1 = (p.position.a << 0);
		x2 = x1 + 6;
		y1 = (p.position.c << 0) - 6;
		y2 = y1 + 12;
	}else if (ang >= 45 && ang < 135){
		x1 = (p.position.a << 0) - 6;
		x2 = x1 + 12;
		y1 = (p.position.c << 0) - 5;
		y2 = y1 + 6;
	}else if (ang >= 135 && ang < 225){
		x1 = (p.position.a << 0) - 5;
		x2 = x1 + 6;
		y1 = (p.position.c << 0) - 6;
		y2 = y1 + 12;
	}else if (ang >= 225 && ang < 315){
		x1 = (p.position.a << 0) - 6;
		x2 = x1 + 12;
		y1 = (p.position.c << 0);
		y2 = y1 + 6;
	}
	
	return vec4(x1,y1,x2,y2);
};

MapManager.prototype.drawMap = function(){
	var x1, x2, y1, y2;
	
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
			if (t.w){ 
				for (var wy=fy;wy<cy;wy++) this.game.drawBlock(j, wy, i, t.w);
				
				fy = fy + t.h;
				cy = cy + t.h;
			}else if (t.dw){
				// Draw angled 
				for (var wy=fy;wy<cy;wy++) this.game.drawAngledWall(j, wy, i, t.dw, t.aw);
			}else if (t.wd){
				// Wall Door 
				for (var wy=fy;wy<cy;wy++){ 
					if (wy == fy)
						this.game.drawDoorWall(j, wy, i, t.wd, t.ver);
					else 
						this.game.drawDoorCube(j, wy, i, t.wd, t.ver);
				}
			}
			
			// Draw floor
			if (t.f){
				var tt = t.f;
				if (this.isWaterTile(tt)) tt = tt + (this.waterFrame << 0);
				this.game.drawFloor(j, -0.5 + fy, i, tt, false);
			}
			
			// Draw ceil
			if (t.c){
				if (t.ch) cy = t.ch;
				var tt = t.c;
				this.game.drawFloor(j, -0.5 + cy, i, tt, true);
			}
		}
	}
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

MapManager.prototype.loop = function(){
	this.step();
	
	this.drawMap();
	
	if (this.player.moved){ this.getInstancesToDraw(); }
	
	for (var i=0,len=this.orderInstances.length;i<len;i++){
		var ins = this.orderInstances[i].ins;
		
		ins.loop();
	}
	
	for (var i=0,len=this.doors.length;i<len;i++){
		var ins = this.doors[i];
		
		var xx = Math.abs(ins.position.a - this.player.position.a);
		var zz = Math.abs(ins.position.z - this.player.position.z);
		
		if (xx > 6 || zz > 6) continue;
		
		ins.loop();
		this.game.drawDoor(ins.position.a, ins.position.b, ins.position.c, ins.rotation, ins.textureCode);
	}
	
	this.player.loop();
};
