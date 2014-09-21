function Billboard(position, textureCode, mapManager){
	this.position = position;
	this.textureCode = textureCode;
	this.mapManager = mapManager;
}

Billboard.prototype.draw = function(){
	var game = this.mapManager.game;
	game.drawBillboard(this.position,this.textureCode);
};

Billboard.prototype.loop = function(){
	this.draw();
};
