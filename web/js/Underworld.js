function Underworld(){
	this.GL = new WebGL(vec2(640, 400), $$("divGame"));
	this.UI = new UI(vec2(640, 400), $$("divGame"));
	
	this.cube = ObjectFactory.cube(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	this.floor = ObjectFactory.floor(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	
	this.map = null;
	this.keys = [];
	this.images = {};
	this.textures = [];
	
	this.fps = (1000 / 30) << 0;
	this.lastT = 0;
	this.numberFrames = 0;
	this.firstFrame = Date.now();
	
	this.loadImages();
}

Underworld.prototype.loadImages = function(){
	this.textures = [null];
	this.textures.push(this.GL.loadImage("img/texWall1.png", true, 1, true));
	this.textures.push(this.GL.loadImage("img/texWall2.png", true, 2, true));
	this.textures.push(this.GL.loadImage("img/texWall3.png", true, 3, true));
	this.textures.push(this.GL.loadImage("img/texFloor1.png", true, 4));
	this.textures.push(this.GL.loadImage("img/texWater1_0.png", true, 5));
	this.textures.push(this.GL.loadImage("img/texWater1_1.png", true, 6));
	this.textures.push(this.GL.loadImage("img/texCeil1.png", true, 7));
};

Underworld.prototype.getTextureById = function(textureId){
	if (!this.textures[textureId]) throw "Invalid textureId: " + textureId;
	
	return this.textures[textureId];
};

Underworld.prototype.loadGame = function(){
	var game = this;
	
	if (game.GL.areImagesReady()){
		game.map = new MapManager(this, "test");
		game.loop();
	}else{
		requestAnimFrame(function(){ game.loadGame(); });
	}
};

Underworld.prototype.drawBlock = function(x, y, z, texId){
	var game = this;
	var camera = game.map.player;
	
	game.cube.position.set(x, y, z);
	game.GL.drawObject(game.cube, camera, game.getTextureById(texId).texture);
};

Underworld.prototype.drawFloor = function(x, y, z, texId){
	var game = this;
	var camera = game.map.player;
	
	game.floor.position.set(x, y, z);
	game.GL.drawObject(game.floor, camera, game.getTextureById(texId).texture);
};

Underworld.prototype.drawFPS = function(/*float*/ now){
	var fps = Math.floor((++this.numberFrames) / ((now - this.firstFrame) / 1000));
	var ctx = this.UI.ctx;
	ctx.font = '16px "Courier"';
	ctx.fillStyle = "white";
	ctx.fillText("FPS: " + fps + "/30", 16, 16);
};

Underworld.prototype.loop = function(){
	var game = this;
	
	var now = Date.now();
	var dT = (now - game.lastT);
	
	// Limit the game to the base speed of the game
	if (dT > game.fps){
		game.lastT = now - (dT % game.fps);
		
		var gl = game.GL.ctx;
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		game.UI.clear();
		
		game.map.loop();
		game.drawFPS(now);
	}
	
	requestAnimFrame(function(){ game.loop(); });
};

addEvent(window, "load", function(){
	var game = new Underworld();
	game.loadGame();
	
	addEvent(document, "keydown", function(e){
		if (window.event) e = window.event;
		
		if (game.keys[e.keyCode] == 2) return;
		game.keys[e.keyCode] = 1;
	});
	
	addEvent(document, "keyup", function(e){
		if (window.event) e = window.event;
		
		game.keys[e.keyCode] = 0;
	});
	
	addEvent(window, "focus", function(){
		game.firstFrame = Date.now();
		game.numberFrames = 0;
	});
});
