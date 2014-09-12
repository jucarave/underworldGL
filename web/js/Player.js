function Player(position, direction, mapManager){
	this.position = position;
	this.rotation = direction;
	this.mapManager = mapManager;
	
	this.rotationSpd = vec2(Math.degToRad(1), Math.degToRad(4));
	this.movementSpd = 0.1;
	this.cameraHeight = 0.5;
	this.maxVertRotation = Math.degToRad(45);
	
	this.targetY = 0.0;
	this.ySpeed = 0.0;
	this.yGravity = 0.0;
	
	this.jog = vec2(0.0, 1);
	this.onWater = false;
}

Player.prototype.moveTo = function(xTo, zTo){
	// var A = xTo * 5;
	// var B = zTo * 5;
	var moved = false;
	
	if (this.onWater){
		this.jog.a += 0.01 * this.jog.b;
		if (this.jog.a >= 0.03 && this.jog.b == 1) this.jog.b = -1; else
		if (this.jog.a <= -0.03 && this.jog.b == -1) this.jog.b = 1;
		
		xTo /= 2;
		zTo /= 2;
	}else{
		this.jog.a += 0.008 * this.jog.b;
		if (this.jog.a >= 0.03 && this.jog.b == 1) this.jog.b = -1; else
		if (this.jog.a <= -0.03 && this.jog.b == -1) this.jog.b = 1;
	}
	
	/*if (!this.mapManager.isSolid(this.position.a + A, this.position.b, this.position.c, this.cameraHeight, this.onWater)){
		this.position.a += xTo;
		moved = true;
	}
	
	if (!this.mapManager.isSolid(this.position.a, this.position.b, this.position.c + B, this.cameraHeight, this.onWater)){
		this.position.c += zTo;
		moved = true;
	}
	
	if (moved) this.doVerticalChecks();*/
	
	var movement = vec2(xTo, zTo);
	var spd = vec2(xTo * 5, zTo * 5);
	var normal = this.mapManager.getWallNormal(this.position, spd, this.cameraHeight, this.onWater);
	
	if (normal){
		normal = normal.clone();
		var dist = movement.dot(normal);
		normal.multiply(-dist);
		movement.sum(normal);
	}
	
	this.position.a += movement.a;
	this.position.c += movement.b;
	
	return moved;
};

Player.prototype.movement = function(){
	var game = this.mapManager.game;
	
	if (game.keys[81] == 1){ this.rotation.b += this.rotationSpd.b; }else
	if (game.keys[69] == 1){ this.rotation.b -= this.rotationSpd.b; }
	
	if (game.keys[49] == 1){ this.rotation.a += this.rotationSpd.a; }else
	if (game.keys[50] == 1){ this.rotation.a = 0; }else
	if (game.keys[51] == 1){ this.rotation.a -= this.rotationSpd.a; }
	
	var A = 0.0, B = 0.0;
	if (game.keys[87] == 1){
		A = Math.cos(this.rotation.b) * this.movementSpd;
		B = -Math.sin(this.rotation.b) * this.movementSpd;
	}else if (game.keys[83] == 1){
		A = -Math.cos(this.rotation.b) * this.movementSpd;
		B = Math.sin(this.rotation.b) * this.movementSpd;
	}
	
	if (game.keys[65] == 1){
		A = Math.cos(this.rotation.b + Math.PI_2) * this.movementSpd;
		B = -Math.sin(this.rotation.b + Math.PI_2) * this.movementSpd;
	}else if (game.keys[68] == 1){
		A = Math.cos(this.rotation.b - Math.PI_2) * this.movementSpd;
		B = -Math.sin(this.rotation.b - Math.PI_2) * this.movementSpd;
	}
	
	if (A != 0.0 || B != 0.0){ this.moveTo(A, B); }else{ this.jog.a = 0; }
	if (this.rotation.a > this.maxVertRotation) this.rotation.a = this.maxVertRotation;
	else if (this.rotation.a < -this.maxVertRotation) this.rotation.a = -this.maxVertRotation;
};

Player.prototype.doVerticalChecks = function(){
	var pointY = this.mapManager.getYFloor(this.position.a, this.position.c);
	var wy = (this.onWater)? 0.3 : 0;
	if (pointY - this.position.b - wy <= 0.3) this.targetY = pointY;
	if (this.mapManager.isWaterPosition(this.position.a, this.position.c) && this.position.b == this.targetY){
		this.movementSpd = 0.05;
		this.onWater = true;
	}else{
		this.movementSpd = 0.1;
		this.onWater = false;
	}
	
	this.cameraHeight = 0.5 + this.jog.a;
};

Player.prototype.step = function(){
	this.movement();
	
	if (this.targetY < this.position.b){
		this.position.b -= 0.1;
		if (this.position.b <= this.targetY) this.position.b = this.targetY;
	}else if (this.targetY > this.position.b){
		this.position.b += 0.08;
		if (this.position.b >= this.targetY) this.position.b = this.targetY;
	}
};

Player.prototype.loop = function(){
	this.step();
};
