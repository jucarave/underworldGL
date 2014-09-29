/*===================================================
				 BUGL Source Code
				
			By Camilo Ramírez (Jucarave)
			
					  2014
===================================================*/

var trianglesCount = 0;
function Underworld(){
	this.size = vec2(320, 200);
	this.glpos = vec2(75, 36);
	
	this.GL = new WebGL(this.size, this.glpos, $$("divGame"));
	this.UI = new UI(this.size, $$("divGame"));
	
	this.inventory = new Inventory();
	this.console = new Console(10, 15, 13, this);
	this.font = '10px "Courier"';
	
	this.create3DObjects();
	AnimatedTexture.init(this.GL.ctx);
	
	this.scene = null;
	this.map = null;
	this.keys = [];
	this.mouse = vec3(0.0, 0.0, 0);
	this.images = {};
	this.music = {};
	this.textures = [];
	this.objectTex = {};
	
	this.fps = (1000 / 30) << 0;
	this.lastT = 0;
	this.numberFrames = 0;
	this.firstFrame = Date.now();
	
	this.loadImages();
	this.loadMusic();
	this.loadTextures();
}

Underworld.prototype.create3DObjects = function(){
	this.cube = ObjectFactory.cube(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx, false);
	this.aWall = ObjectFactory.angledWall(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	this.floor = ObjectFactory.floor(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	this.ceil = ObjectFactory.ceil(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	
	this.door = ObjectFactory.door(vec3(0.5,0.75,0.1), vec2(1.0,1.0), this.GL.ctx, false);
	this.doorW = ObjectFactory.doorWall(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	this.doorC = ObjectFactory.cube(vec3(1.0,1.0,0.1), vec2(1.0,1.0), this.GL.ctx, true);
	
	this.billboard = ObjectFactory.billboard(vec3(1.0,1.0,0.0), vec2(1.0,1.0), this.GL.ctx);
};

Underworld.prototype.loadMusic = function(){
	this.music.title = this.GL.loadAudio(cp + "ogg/Britannian_music.ogg?version=" + version, true);
	this.music.britannian = this.GL.loadAudio(cp + "ogg/Britannian_level.ogg?version=" + version, true);
};

Underworld.prototype.loadImages = function(){
	this.images.titleScreen = this.GL.loadImage(cp + "img/titleScreen.png?version=" + version, false);
	this.images.viewport = this.GL.loadImage(cp + "img/buUI.png?version=" + version, false);
	this.images.scrollFont = this.GL.loadImage(cp + "img/scrollFontWhite.png?version=" + version, false);
};

Underworld.prototype.loadTextures = function(){
	this.textures = [null];
	this.textures.push(this.GL.loadImage(cp + "img/texWall1.png?version=" + version, true, 1, true));
	this.textures.push(this.GL.loadImage(cp + "img/texWall2.png?version=" + version, true, 2, true));
	this.textures.push(this.GL.loadImage(cp + "img/texWall3.png?version=" + version, true, 3, true));
	this.textures.push(this.GL.loadImage(cp + "img/texFloor1.png?version=" + version, true, 4));
	this.textures.push(this.GL.loadImage(cp + "img/texWater1_0.png?version=" + version, true, 5));
	this.textures.push(this.GL.loadImage(cp + "img/texWater1_1.png?version=" + version, true, 6));
	this.textures.push(this.GL.loadImage(cp + "img/texCeil1.png?version=" + version, true, 7));
	
	this.objectTex.door1 = this.GL.loadImage(cp + "img/texDoor1.png?version=" + version, true);
	this.objectTex.lamp1Off = this.GL.loadImage(cp + "img/texLamp1_off.png?version=" + version, true);
	this.objectTex.lamp1 = this.GL.loadImage(cp + "img/texLamp1.png?version=" + version, true);
	this.objectTex.bat = this.GL.loadImage(cp + "img/bat.png?version=" + version, true);
	this.objectTex.items = this.GL.loadImage(cp + "img/texItems.png?version=" + version, true, {imgNum: 1, imgVNum: 1});
};

Underworld.prototype.stopMusic = function(){
	for (var i in this.music){
		var audio = this.music[i];
		
		if (audio.timeO){
			clearTimeout(audio.timeO);
		}else if (audio.isMusic && audio.source){
			audio.source.stop();
			audio.source = null;
		}
	}
};

Underworld.prototype.playMusic = function(musicCode){
	var audioF = this.music[musicCode];
	if (!audioF) return null;
	
	this.stopMusic();
	this.GL.playSound(audioF, true, true);
};

Underworld.prototype.getUI = function(){
	return this.UI.ctx;
};

Underworld.prototype.getTextureById = function(textureId){
	if (!this.textures[textureId]) throw "Invalid textureId: " + textureId;
	
	return this.textures[textureId];
};

Underworld.prototype.getObjectTexture = function(textureCode){
	if (!this.objectTex[textureCode]) throw "Invalid texture code: " + textureCode;
	
	return this.objectTex[textureCode];
};

Underworld.prototype.loadMap = function(map){
	var game = this;
	game.map = new MapManager(this, map);
	game.scene = null;
};

Underworld.prototype.printGreet = function(){
	// Shows a welcome message with the game instructions.
	this.console.addSFMessage("Welcome to BUGL alpha test!");
	this.console.addSFMessage("Press WASD to move, QE to turn around");
	this.console.addSFMessage("1/3 to look up/down, 2 to restore");
	this.console.addSFMessage("Click to interact with objects");
	this.console.addSFMessage("Have fun!");
};

Underworld.prototype.loadGame = function(){
	var game = this;
	
	if (game.GL.areImagesReady()){
		game.console.createSpriteFont(game.images.scrollFont, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?,./", 6);
		game.printGreet();
		
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

Underworld.prototype.drawDoorWall = function(x, y, z, texId, vertical){
	var game = this;
	var camera = game.map.player;
	
	game.doorW.position.set(x, y, z);
	if (vertical) game.doorW.rotation.set(0,Math.PI_2,0); else game.doorW.rotation.set(0,0,0);
	game.GL.drawObject(game.doorW, camera, game.getTextureById(texId).texture);
};

Underworld.prototype.drawDoorCube = function(x, y, z, texId, vertical){
	var game = this;
	var camera = game.map.player;
	
	game.doorC.position.set(x, y, z);
	if (vertical) game.doorC.rotation.set(0,Math.PI_2,0); else game.doorC.rotation.set(0,0,0);
	game.GL.drawObject(game.doorC, camera, game.getTextureById(texId).texture);
};

Underworld.prototype.drawDoor = function(x, y, z, rotation, texId){
	var game = this;
	var camera = game.map.player;
	
	game.door.position.set(x, y, z);
	game.door.rotation.b = rotation;
	game.GL.drawObject(game.door, camera, game.objectTex[texId].texture);
};

Underworld.prototype.drawFloor = function(x, y, z, texId, ceil){
	var game = this;
	var camera = game.map.player;
	
	var floor = (ceil)? game.ceil : game.floor;
	floor.position.set(x, y, z);
	game.GL.drawObject(floor, camera, game.getTextureById(texId).texture);
};

Underworld.prototype.drawBillboard = function(position, texId, billboard){
	var game = this;
	var camera = game.map.player;
	if (!billboard) billboard = game.billboard;
	
	billboard.position.set(position);
	game.GL.drawObject(billboard, camera, game.objectTex[texId].texture);
};

Underworld.prototype.drawFPS = function(/*float*/ now){
	var fps = Math.floor((++this.numberFrames) / ((now - this.firstFrame) / 1000));
	var ctx = this.UI.ctx;
	ctx.font = '10px "Courier"';
	ctx.fillStyle = "white";
	ctx.fillText("FPS: " + fps + "/30", 16, 16);
	
	ctx.fillText("TriCount: " + window.trianglesCount, 16, 24);
};

Underworld.prototype.loop = function(){
	var game = this;
	
	var now = Date.now();
	var dT = (now - game.lastT);
	
	// Limit the game to the base speed of the game
	if (dT > game.fps){
		window.trianglesCount = 0;
		game.lastT = now - (dT % game.fps);
		
		if (this.map != null){
			var gl = game.GL.ctx;
			
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			game.UI.clear();
			
			game.map.loop();
			
			game.UI.ctx.drawImage(game.images.viewport,0,0);
			game.console.render(242, 11);
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
