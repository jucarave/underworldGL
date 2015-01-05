/*===================================================
				 BUGL Source Code
				
			By Camilo Ramírez (Jucarave)
			
					  2014
===================================================*/

function Underworld(){
	this.size = vec2(320, 200);
	this.glpos = vec2(75, 36);
	
	this.GL = new WebGL(this.size, this.glpos, $$("divGame"));
	this.UI = new UI(this.size, $$("divGame"));
	
	this.inventory = new Inventory(10);
	this.console = new Console(10, 15, 13, this);
	this.font = '10px "Courier"';
	
	this.scene = null;
	this.map = null;
	this.keys = [];
	this.mouse = vec3(0.0, 0.0, 0);
	this.images = {};
	this.music = {};
	this.textures = {wall: [], floor: [], ceil: []};
	this.objectTex = {};
	this.models = {};
	
	this.fps = (1000 / 30) << 0;
	this.lastT = 0;
	this.numberFrames = 0;
	this.firstFrame = Date.now();
	
	this.loadImages();
	this.loadMusic();
	this.loadTextures();
	
	this.create3DObjects();
	AnimatedTexture.init(this.GL.ctx);
}

Underworld.prototype.create3DObjects = function(){
	this.door = ObjectFactory.door(vec3(0.5,0.75,0.1), vec2(1.0,1.0), this.GL.ctx, false);
	this.doorW = ObjectFactory.doorWall(vec3(1.0,1.0,1.0), vec2(1.0,1.0), this.GL.ctx);
	this.doorC = ObjectFactory.cube(vec3(1.0,1.0,0.1), vec2(1.0,1.0), this.GL.ctx, true);
	
	this.billboard = ObjectFactory.billboard(vec3(1.0,1.0,0.0), vec2(1.0,1.0), this.GL.ctx);
	
	this.slope = ObjectFactory.slope(vec3(1.0,1.0,1.0), vec2(1.0, 1.0), this.GL.ctx);
	
	this.models.ankh = ObjectFactory.load3DModel("ankh", this.GL.ctx);
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
	this.textures = {wall: [null], floor: [null], ceil: [null], water: [null]};
	
	// Wall textures
	this.textures.wall.push(this.GL.loadImage(cp + "img/texWCrypt.png?version=" + version, true, 1, true));
	this.textures.wall.push(this.GL.loadImage(cp + "img/texWCave.png?version=" + version, true, 2, true));
	this.textures.wall.push(this.GL.loadImage(cp + "img/texWDirt.png?version=" + version, true, 3, true));
	
	// Floor textures
	this.textures.floor.push(this.GL.loadImage(cp + "img/texFCrypt.png?version=" + version, true, 1));
	this.textures.floor.push(this.GL.loadImage(cp + "img/texFCave.png?version=" + version, true, 2));
	this.textures.floor.push(this.GL.loadImage(cp + "img/texFDirt.png?version=" + version, true, 3));
	
	// Water textures
	this.textures.water.push(this.GL.loadImage(cp + "img/texWater1_0.png?version=" + version, true, 1));
	this.textures.water.push(this.GL.loadImage(cp + "img/texWater1_1.png?version=" + version, true, 2));
	
	// Ceiling textures
	this.textures.ceil.push(this.GL.loadImage(cp + "img/texCeil1.png?version=" + version, true, 1));
	this.textures.ceil.push(null);
	this.textures.ceil.push(this.GL.loadImage(cp + "img/texCDirt.png?version=" + version, true, 2));
	
	this.objectTex.door1 = this.GL.loadImage(cp + "img/texDoor1.png?version=" + version, true);
	this.objectTex.lamp1Off = this.GL.loadImage(cp + "img/texLamp1_off.png?version=" + version, true);
	this.objectTex.lamp1 = this.GL.loadImage(cp + "img/texLamp1.png?version=" + version, true);
	this.objectTex.items = this.GL.loadImage(cp + "img/texItems.png?version=" + version, true, {imgNum: 1, imgVNum: 1});
	
	// Enemies
	this.objectTex.gargoyle_run = this.GL.loadImage(cp + "img/gargoyleRun.png?version=" + version, true);
	
	// 3D Objects
	this.objectTex.ankh = this.GL.loadImage(cp + "img/ankh.png?version=" + version, true);
	
	DEBUG.setTextures(this.textures);
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

Underworld.prototype.getTextureById = function(textureId, type){
	if (!this.textures[type][textureId]) throw "Invalid textureId: " + textureId;
	
	return this.textures[type][textureId];
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

Underworld.prototype.lineBoxCollision = function(line, box){
	var l = {x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2};
	
	if (l.x2 < l.x1){
		var x1 = l.x1;
		var y1 = l.y1; 
		l = {x1: l.x2, y1: l.y2, x2: x1, y2: y1}; 
	}
	
	var yy = l.y2 - l.y1;
	var xx = l.x2 - l.x1;
	var m = yy / xx;
	
	var cx1, cx2, cy1, cy2;
	cx1 = box.x - l.x1;
	cx2 = cx1 + box.w;
	
	if (cx1 < 0) cx1 = 0;
	if (cx2 < 0) cx2 = 0;
	if (cx1 > xx) cx1 = xx;
	if (cx2 > xx) cx2 = xx;
	
	cy1 = m * cx1 + l.y1;
	cy2 = m * cx2 + l.y1;
	cx1 += l.x1;
	cx2 += l.x1;
	
	if (cx2 < box.x) return false;
	if (cx2 > box.x + box.w) return false;
	
	if (m < 0){
		if (cy2 > box.y + box.h) return false;
		if (cy1 < box.y) return false;
	}else if (m > 0){
		if (cy1 > box.y + box.h) return false;
		if (cy2 < box.y) return false;
	}
	
	return true;
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

Underworld.prototype.drawObject = function(object, texture){
	var camera = this.map.player;
	
	this.GL.drawObject(object, camera, texture);
};

Underworld.prototype.drawBlock = function(blockObject, texId){
	var camera = this.map.player;
	
	this.GL.drawObject(blockObject, camera, this.getTextureById(texId, "wall").texture);
};

Underworld.prototype.drawDoorWall = function(x, y, z, texId, vertical){
	var game = this;
	var camera = game.map.player;
	
	game.doorW.position.set(x, y, z);
	if (vertical) game.doorW.rotation.set(0,Math.PI_2,0); else game.doorW.rotation.set(0,0,0);
	game.GL.drawObject(game.doorW, camera, game.getTextureById(texId, "wall").texture);
};

Underworld.prototype.drawDoorCube = function(x, y, z, texId, vertical){
	var game = this;
	var camera = game.map.player;
	
	game.doorC.position.set(x, y, z);
	if (vertical) game.doorC.rotation.set(0,Math.PI_2,0); else game.doorC.rotation.set(0,0,0);
	game.GL.drawObject(game.doorC, camera, game.getTextureById(texId, "wall").texture);
};

Underworld.prototype.drawDoor = function(x, y, z, rotation, texId){
	var game = this;
	var camera = game.map.player;
	
	game.door.position.set(x, y, z);
	game.door.rotation.b = rotation;
	game.GL.drawObject(game.door, camera, game.objectTex[texId].texture);
};

Underworld.prototype.drawFloor = function(floorObject, texId, typeOf){
	var game = this;
	var camera = game.map.player;
	
	var ft = typeOf;
	game.GL.drawObject(floorObject, camera, game.getTextureById(texId, ft).texture);
};

Underworld.prototype.drawBillboard = function(position, texId, billboard){
	var game = this;
	var camera = game.map.player;
	if (!billboard) billboard = game.billboard;
	
	billboard.position.set(position);
	game.GL.drawObject(billboard, camera, game.objectTex[texId].texture);
};

Underworld.prototype.drawSlope = function(slopeObject, texId){
	var game = this;
	var camera = game.map.player;
	
	game.GL.drawObject(slopeObject, camera, game.getTextureById(texId, "floor").texture);
};

Underworld.prototype.loop = function(){
	var game = this;
	
	var now = Date.now();
	var dT = (now - game.lastT);
	
	// Limit the game to the base speed of the game
	if (dT > game.fps){
		game.resetDebugParameters();
		game.lastT = now - (dT % game.fps);
		
		if (!game.GL.active){
			requestAnimFrame(function(){ game.loop(); }); 
			return;
		}
		
		if (this.map != null){
			var gl = game.GL.ctx;
			
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			game.UI.clear();
			
			game.map.loop();
			
			game.UI.ctx.drawImage(game.images.viewport,0,0);
			game.console.render(242, 11);
			
			game.debugLoop(now);
		}
		
		if (this.scene != null){
			game.scene.loop();
		}
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
		
		DEBUG.keyDown(e.keyCode);
		if (e.keyCode == 8){
			e.preventDefault();
			e.cancelBubble = true;
		}
		
		if (game.keys[e.keyCode] == 2) return;
		game.keys[e.keyCode] = 1;
	});
	
	addEvent(document, "keyup", function(e){
		if (window.event) e = window.event;
		
		if (e.keyCode == 8){
			e.preventDefault();
			e.cancelBubble = true;
		}
		
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
