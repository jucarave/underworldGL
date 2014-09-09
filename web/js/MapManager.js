function MapManager(game, map){
	this.map = null;
	
	this.waterTiles = [];
	this.waterFrame = 0;
	
	this.game = game;
	this.player = null;
	
	if (map == "test"){
		this.createTestMap();
	}
}

MapManager.prototype.createTestMap = function(){
	var A, B, C, D, E, F, G, H;
	// Walls
	A = {w: 3, y: -1, h: 2};
	B = {w: 3, y: 0, h: 1};
	C = {w: 3, y: -1, h: 1, c: 7, f: 4};
	D = {w: 1, y: 0, h: 1};
	E = {w: 1, y: -1, h: 1, c: 7, f: 1};
	F = {w: 1, y: -1, h: 2};
	G = {w: 2, y: -1, h: 1, c: 2, f: 2};
	H = {w: 2, y: 0, h: 1};
	
	var I, J, K, L;
	// Floors
	I = {f: 5, c: 7, y: -0.3, h: 1.3};
	J = {f: 4, c: 7, y: 0, h: 1};
	K = {f: 1, c: 7, y: 0, h: 1};
	L = {f: 2, c: 2, y: 0, h: 1};
	
	this.map = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,A,A,A,A,A,A,A,0,0,0,0,0,0,0],
		[0,0,0,0,0,A,I,C,C,C,I,A,0,0,0,0,0,0,0],
		[0,0,0,0,0,A,I,I,C,I,I,A,0,0,0,0,0,0,0],
		[0,0,0,0,0,A,I,I,C,I,I,A,0,0,0,0,0,0,0],
		[0,0,0,0,0,A,I,I,C,I,I,A,0,0,0,0,0,0,0],
		[0,0,0,0,0,A,I,I,C,I,I,A,0,0,0,0,0,0,0],
		[0,0,0,0,0,A,A,A,J,A,A,A,0,0,0,D,D,D,0],
		[0,0,0,0,0,0,0,B,J,B,0,0,0,0,D,D,K,D,0],
		[0,0,0,0,0,0,0,B,J,B,0,0,0,D,D,K,K,D,D],
		[0,0,0,0,0,0,0,B,J,B,B,B,B,D,K,K,K,K,D],
		[0,0,0,0,0,0,0,B,J,J,J,J,J,J,K,K,K,K,D],
		[0,0,0,0,0,0,0,B,B,B,B,J,B,D,K,K,K,K,D],
		[0,0,0,0,0,0,0,0,0,0,B,J,B,D,K,K,K,K,D],
		[0,0,0,0,0,0,0,0,0,0,B,J,B,D,D,D,D,D,D],
		[0,0,0,0,0,0,0,D,D,D,B,J,B,D,D,D,0,0,0],
		[0,0,0,0,0,0,0,D,E,E,E,E,E,E,E,D,0,0,0],
		[0,0,0,F,F,F,F,F,I,I,I,I,I,I,I,F,0,0,0],
		[0,0,0,F,I,I,I,I,I,I,I,I,I,I,I,F,0,0,0],
		[0,H,H,F,G,F,F,F,I,I,I,I,I,I,I,F,0,0,0],
		[0,H,L,L,L,H,H,D,E,E,E,E,E,E,E,D,0,0,0],
		[0,H,L,L,L,L,H,D,D,D,D,D,D,D,D,D,0,0,0],
		[0,H,L,L,L,L,H,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,H,H,H,H,H,H,0,0,0,0,0,0,0,0,0,0,0,0]
	];
	
	this.waterTiles = [5];
	this.player = new Player(vec3(8.5, 0.0, 3.5), vec3(0.0, Math.PI3_2, 0.0), this);
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

MapManager.prototype.isSolid = function(x, y, z, h){
	x = (x << 0);
	z = (z << 0);
	
	if (!this.map[z]) return false;
	if (this.map[z][x] === undefined) return false;
	if (this.map[z][x] === 0) return false;
	var t = this.map[z][x];
	
	if (!t.w) return false;
	if (t.y+t.h <= y) return false;
	else if (t.y > y + h) return false;
	
	var tex = this.game.getTextureById(t.w);
	return tex.isSolid;
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
	
	return tt;
};

MapManager.prototype.drawMap = function(){
	var x1, x2, y1, y2;
	
	x1 = (this.player.position.a << 0) - 10;
	x2 = x1 + 20;
	y1 = (this.player.position.c << 0) - 10;
	y2 = y1 + 20;
	
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
			}
			
			// Draw floor
			if (t.f){
				var tt = t.f;
				if (this.isWaterTile(tt)) tt = tt + (this.waterFrame << 0);
				this.game.drawFloor(j, -0.5 + fy, i, tt);
			}
			
			// Draw ceil
			if (t.c){
				var tt = t.c;
				this.game.drawFloor(j, -0.5 + cy, i, tt);
			}
		}
	}
};

MapManager.prototype.step = function(){
	this.waterFrame += 0.1;
	if (this.waterFrame >= 2) this.waterFrame = 0;
};

MapManager.prototype.loop = function(){
	this.step();
	
	this.player.loop();
	
	this.drawMap();
};
