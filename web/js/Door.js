function Door(position, wallPosition, textureCode){
	this.position = position;
	this.wallPosition = wallPosition;
	this.rotation = 0;
	this.textureCode = textureCode;
	
	this.closed = true;
	this.animation =  0;
	this.openSpeed = Math.degToRad(10);
}

Door.prototype.activate = function(){
	if (this.animation != 0) return;
	
	if (this.closed) this.animation = 1;
	else this.animation = 2; 
};

Door.prototype.loop = function(){
	if (this.animation == 1 && this.rotation < Math.PI_2){
		this.rotation += this.openSpeed;
		if (this.rotation >= Math.PI_2){
			this.rotation = Math.PI_2;
			this.animation  = 0;
			this.closed = false;
		}
	}else if (this.animation == 2 && this.rotation > 0){
		this.rotation -= this.openSpeed;
		if (this.rotation <= 0){
			this.rotation = 0;
			this.animation  = 0;
			this.closed = true;
		}
	}
};
