function Underworld(){
	this.size = vec2(320, 200);
	this.glpos = vec2(75, 36);
	
	this.GL = new WebGL(this.size, this.glpos, $$("divGame"));
	this.UI = new UI(this.size, $$("divGame"));
	
	this.font = '10px "Courier"';
	
	this.cube = ObjectFactory.cube(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	this.aWall = ObjectFactory.angledWall(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	this.floor = ObjectFactory.floor(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	this.ceil = ObjectFactory.ceil(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	
	this.scene = null;
	this.map = null;
	this.keys = [];
	this.mouse = vec3(0.0, 0.0, 0);
	this.images = {};
	this.music = {};
	this.textures = [];
	
	this.fps = (1000 / 30) << 0;
	this.lastT = 0;
	this.numberFrames = 0;
	this.firstFrame = Date.now();
	
	this.loadImages();
	this.loadMusic();
	this.loadTextures();
}

Underworld.prototype.loadMusic = function(){
	this.music.britannian = this.GL.loadAudio("ogg/Britannian_music.ogg", true);
};

Underworld.prototype.loadImages = function(){
	this.images.titleScreen = this.GL.loadImage("img/titleScreen.png", false);
	this.images.viewport = this.GL.loadImage("img/buUI.png", false);
};

Underworld.prototype.loadTextures = function(){
	this.textures = [null];
	this.textures.push(this.GL.loadImage("img/texWall1.png", true, 1, true));
	this.textures.push(this.GL.loadImage("img/texWall2.png", true, 2, true));
	this.textures.push(this.GL.loadImage("img/texWall3.png", true, 3, true));
	this.textures.push(this.GL.loadImage("img/texFloor1.png", true, 4));
	this.textures.push(this.GL.loadImage("img/texWater1_0.png", true, 5));
	this.textures.push(this.GL.loadImage("img/texWater1_1.png", true, 6));
	this.textures.push(this.GL.loadImage("img/texCeil1.png", true, 7));
};

Underworld.prototype.playMusic = function(musicCode){
	var audioF = this.music[musicCode];
	if (!audioF) return null;
	
	this.GL.playSound(audioF, true, true);
};

Underworld.prototype.getUI = function(){
	return this.UI.ctx;
};

Underworld.prototype.getTextureById = function(textureId){
	if (!this.textures[textureId]) throw "Invalid textureId: " + textureId;
	
	return this.textures[textureId];
};

Underworld.prototype.loadMap = function(map){
	var game = this;
	game.map = new MapManager(this, map);
	game.scene = null;
};

Underworld.prototype.loadGame = function(){
	var game = this;
	
	if (game.GL.areImagesReady()){
		game.scene = new TitleScreen(game);
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

Underworld.prototype.drawAngledWall = function(x, y, z, texId, angle){
	var game = this;
	var camera = game.map.player;
	angle = Math.degToRad(90 * angle);
	
	game.aWall.position.set(x, y, z);
	game.aWall.rotation.set(0, angle, 0);
	game.GL.drawObject(game.aWall, camera, game.getTextureById(texId).texture);
};

Underworld.prototype.drawFloor = function(x, y, z, texId, ceil){
	var game = this;
	var camera = game.map.player;
	
	var floor = (ceil)? game.ceil : game.floor;
	floor.position.set(x, y, z);
	game.GL.drawObject(floor, camera, game.getTextureById(texId).texture);
};

Underworld.prototype.drawFPS = function(/*float*/ now){
	var fps = Math.floor((++this.numberFrames) / ((now - this.firstFrame) / 1000));
	var ctx = this.UI.ctx;
	ctx.font = '10px "Courier"';
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
		
		if (this.map != null){
			var gl = game.GL.ctx;
			
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			game.UI.clear();
			
			game.map.loop();
			
			game.UI.ctx.drawImage(game.images.viewport,0,0);
		}
		
		if (this.scene != null){
			game.scene.loop();
		}
		
		game.drawFPS(now);
	}
	
	requestAnimFrame(function(){ game.loop(); });
};

Underworld.prototype.getKeyPressed = function(keyCode){
	if (this.keys[keyCode] == 1){
		this.keys[keyCode] = 2;
		return true;
	}
	
	return false;
};

Underworld.prototype.getMouseButtonPressed = function(){
	if (this.mouse.c == 1){
		this.mouse.c = 2;
		return true;
	}
	
	return false;
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
	
	var canvas = game.UI.canvas;
	addEvent(canvas, "mousedown", function(e){
		if (window.event) e = window.event;
		
		game.mouse.a = Math.round((e.clientX - canvas.offsetLeft) / game.UI.scale);
		game.mouse.b = Math.round((e.clientY - canvas.offsetTop) / game.UI.scale);
		
		if (game.mouse.c == 2) return;
		game.mouse.c = 1;
	});
	
	addEvent(canvas, "mouseup", function(e){
		if (window.event) e = window.event;
		
		game.mouse.a = Math.round((e.clientX - canvas.offsetLeft) / game.UI.scale);
		game.mouse.b = Math.round((e.clientY - canvas.offsetTop) / game.UI.scale);
		game.mouse.c = 0;
	});
	
	addEvent(canvas, "mousemove", function(e){
		if (window.event) e = window.event;
		
		game.mouse.a = Math.round((e.clientX - canvas.offsetLeft) / game.UI.scale);
		game.mouse.b = Math.round((e.clientY - canvas.offsetTop) / game.UI.scale);
	});
	
	addEvent(window, "focus", function(){
		game.firstFrame = Date.now();
		game.numberFrames = 0;
	});
	
	addEvent(window, "resize", function(){
		var scale = $$("divGame").offsetHeight / game.size.b;
		var canvas = game.GL.canvas;
		canvas.style.top = (game.glpos.b * scale) + "px";
		canvas.style.left = (-game.glpos.a * scale) + "px";
		
		canvas = game.UI.canvas;
		game.UI.scale = canvas.offsetHeight / canvas.height;
	});
});
