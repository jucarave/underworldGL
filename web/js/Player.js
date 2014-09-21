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
	
	var movement = vec2(xTo, zTo);
	var spd = vec2(xTo * 2, 0);
	
	for (var i=0;i<2;i++){
		var normal = this.mapManager.getWallNormal(this.position, spd, this.cameraHeight, this.onWater);
		
		if (normal){
			normal = normal.clone();
			var dist = movement.dot(normal);
			normal.multiply(-dist);
			movement.sum(normal);
		}
		
		spd = vec2(0, zTo * 2);
	}
	
	if (movement.a != 0 || movement.b != 0){
		this.position.a += movement.a;
		this.position.c += movement.b;
		this.doVerticalChecks();
		moved = true;
	}
	
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

Player.prototype.checkDoor = function(){
	if (this.mapManager.game.getKeyPressed(13)){
		var xx = (this.position.a + Math.cos(this.rotation.b)) << 0;
		var zz = (this.position.c - Math.sin(this.rotation.b)) << 0;
		
		var door = this.mapManager.getDoorAt(xx, this.position.b, zz);
		if (door) door.activate();
	}
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
	this.checkDoor();
	
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
