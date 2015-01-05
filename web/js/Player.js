function Player(position, direction, mapManager){
	this.position = position;
	this.rotation = direction;
	this.mapManager = mapManager;
	
	this.rotationSpd = vec2(Math.degToRad(1), Math.degToRad(4));
	this.movementSpd = 0.1;
	this.cameraHeight = 0.5;
	this.maxVertRotation = Math.degToRad(45);
	
	this.targetY = position.b;
	this.ySpeed = 0.0;
	this.yGravity = 0.0;
	
	this.jog = vec4(0.0, 1, 0.0, 1);
	this.onWater = false;
	this.moved = false;
	
	if (DEBUG){
		DEBUG.player = this;
		var spawn = localStorage.getItem("SPAWNTEMP");
		if (spawn != null){
			var p = spawn.split(",");
			this.position.set(parseFloat(p[0]),parseFloat(p[1]),parseFloat(p[2]));
			this.rotation.b = Math.degToRad(parseFloat(p[3]));
			this.targetY = this.position.b;
		}
	}
}

Player.prototype.jogMovement = function(){
	if (this.onWater){
		this.jog.a += 0.005 * this.jog.b;
		if (this.jog.a >= 0.03 && this.jog.b == 1) this.jog.b = -1; else
		if (this.jog.a <= -0.03 && this.jog.b == -1) this.jog.b = 1;
	}else{
		this.jog.a += 0.008 * this.jog.b;
		if (this.jog.a >= 0.03 && this.jog.b == 1) this.jog.b = -1; else
		if (this.jog.a <= -0.03 && this.jog.b == -1) this.jog.b = 1;
	}
};

Player.prototype.moveTo = function(xTo, zTo){
	if (DEBUG.fly){
		xTo *= 1.5;
		zTo *= 1.5;
	}
	
	var moved = false;
	
	if (this.onWater){ xTo /= 2; zTo /=2; }
	var movement = vec2(xTo, zTo);
	var spd = vec2(xTo * 1.5, 0);
	var fakePos = this.position.clone();
		
	if (!DEBUG.clip){
		for (var i=0;i<2;i++){
			var normal = this.mapManager.getWallNormal(fakePos, spd, this.cameraHeight, this.onWater);
			if (!normal){ normal = this.mapManager.getDoorNormal(fakePos, spd, this.cameraHeight, this.onWater); }
			if (!normal){ normal = this.mapManager.getInstanceNormal(fakePos, spd, this.cameraHeight); } 
			
			if (normal){
				normal = normal.clone();
				var dist = movement.dot(normal);
				normal.multiply(-dist);
				movement.sum(normal);
			}
			
			fakePos.a += movement.a;
			
			spd = vec2(0, zTo * 1.5);
		}
	}
	
	if (movement.a != 0 || movement.b != 0){
		this.position.a += movement.a;
		this.position.c += movement.b;
		this.doVerticalChecks();
		this.jogMovement();
		moved = true;
	}
	
	this.moved = moved;
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
	
	if (A != 0.0 || B != 0.0){ this.moveTo(A, B); }else{ this.jog.a = 0.0; }
	if (this.rotation.a > this.maxVertRotation) this.rotation.a = this.maxVertRotation;
	else if (this.rotation.a < -this.maxVertRotation) this.rotation.a = -this.maxVertRotation;
};

Player.prototype.checkAction = function(){
	if (this.mapManager.game.getKeyPressed(13)){
		var xx = (this.position.a + Math.cos(this.rotation.b)) << 0;
		var zz = (this.position.c - Math.sin(this.rotation.b)) << 0;
		
		if ((this.position.a << 0) == xx && (this.position.c << 0) == zz) return;
		
		var door = this.mapManager.getDoorAt(xx, this.position.b, zz);
		if (door){ 
			door.activate();
		}else{
			var object = this.mapManager.getInstanceAtGrid(vec3(xx, this.position.b, zz));
			if (object && object.activate)
				object.activate();
		}
	}
};

Player.prototype.doVerticalChecks = function(){
	if (DEBUG.fly) return;
	
	var pointY = this.mapManager.getYFloor(this.position.a, this.position.c);
	var wy = (this.onWater)? 0.3 : 0;
	var py = Math.floor((pointY - (this.position.b + wy)) * 100) / 100;
	if (py <= 0.3) this.targetY = pointY;
	if (this.mapManager.isWaterPosition(this.position.a, this.position.c)){
		if (this.position.b == this.targetY)
			this.movementSpd = 0.05;
		this.onWater = true;
	}else{
		this.movementSpd = 0.1;
		this.onWater = false;
	}
	
	this.cameraHeight = 0.5 + this.jog.a + this.jog.c;
};

Player.prototype.doFloat = function(){
	if (this.onWater && this.jog.a == 0.0){
		this.jog.c += 0.005 * this.jog.d;
		if (this.jog.c >= 0.03 && this.jog.d == 1) this.jog.d = -1; else
		if (this.jog.c <= -0.03 && this.jog.d == -1) this.jog.d = 1;
		this.cameraHeight = 0.5 + this.jog.a + this.jog.c;
	}else{
		this.jog.c = 0.0;
	}
};

Player.prototype.step = function(){
	this.doFloat();
	this.movement();
	this.checkAction();
	
	if (this.targetY < this.position.b){
		this.position.b -= 0.1;
		this.jog.a = 0.0;
		if (this.position.b <= this.targetY) this.position.b = this.targetY;
	}else if (this.targetY > this.position.b){
		this.position.b += 0.08;
		this.jog.a = 0.0;
		if (this.position.b >= this.targetY) this.position.b = this.targetY;
	}
	
	// FLY
	if (DEBUG.fly){
		var game = this.mapManager.game;
		if (game.keys[38] == 1){
			this.position.b += 0.1;
		}else if (game.keys[40] == 1){
			this.position.b -= 0.1;
		}
		
		this.targetY = this.position.b;
	}
};

Player.prototype.loop = function(){
	if (DEBUG.onDebug) return;
	
	this.moved = false;
	this.step();
};
