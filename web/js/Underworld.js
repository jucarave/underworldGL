function Underworld(){
	this.GL = new WebGL(vec2(640, 400), $$("divGame"));
	
	this.camera = {position: vec3(0.0,0.0,0.0), rotation: vec3(0.0,0.0,0.0)};
	
	this.cube = ObjectFactory.cube(vec3(2.0,2.0,2.0), vec2(1.0,1.0), this.GL.ctx);
	this.cube.position.c = -6;
	
	this.keys = [];
	this.images = {};
	
	this.loadImages();
}

Underworld.prototype.loadImages = function(){
	this.images.texWall1 = this.GL.loadImage("img/texWall1.png", true);
};

Underworld.prototype.loadGame = function(){
	var game = this;
	
	if (game.GL.areImagesReady()){
		game.loop();
	}else{
		requestAnimFrame(function(){ game.loadGame(); });
	}
};

Underworld.prototype.tempCameraControl = function(){
	if (this.keys[81] == 1){ this.camera.rotation.b += 2; }else
	if (this.keys[69] == 1){ this.camera.rotation.b -= 2; }
	
	if (this.keys[49] == 1){ this.camera.rotation.a += 1; }else
	if (this.keys[50] == 1){ this.camera.rotation.a = 0; }else
	if (this.keys[51] == 1){ this.camera.rotation.a -= 1; }
	
	if (this.keys[87] == 1){
		this.camera.position.a += Math.cos(Math.degToRad(this.camera.rotation.b + 90)) * 0.2;
		this.camera.position.c -= Math.sin(Math.degToRad(this.camera.rotation.b + 90)) * 0.2;
	}else if (this.keys[83] == 1){
		this.camera.position.a += Math.cos(Math.degToRad(this.camera.rotation.b - 90)) * 0.2;
		this.camera.position.c -= Math.sin(Math.degToRad(this.camera.rotation.b - 90)) * 0.2;
	}
	
	if (this.keys[65] == 1){
		this.camera.position.a += Math.cos(Math.degToRad(this.camera.rotation.b + 180)) * 0.2;
		this.camera.position.c -= Math.sin(Math.degToRad(this.camera.rotation.b + 180)) * 0.2;
	}else if (this.keys[68] == 1){
		this.camera.position.a += Math.cos(Math.degToRad(this.camera.rotation.b)) * 0.2;
		this.camera.position.c -= Math.sin(Math.degToRad(this.camera.rotation.b)) * 0.2;
	}
};

Underworld.prototype.loop = function(){
	var game = this;
	var gl = game.GL.ctx;
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	/*game.cube.rotation.a += 1;
	game.cube.rotation.b += 1;
	game.cube.rotation.c += 1;*/
	
	game.tempCameraControl();
	
	game.GL.drawObject(game.cube, game.camera, game.images.texWall1.texture);
	
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
});
