function Item(position, item, mapManager){
	var gl = mapManager.game.GL.ctx;
	
	this.position = position;
	this.item = item;
	this.mapManager = mapManager;
	this.billboard = ObjectFactory.billboard(vec3(1.0,1.0,1.0), vec2(1.0, 1.0), gl);
	
	this.textureCode = item.tex;
	this.billboard.texBuffer = AnimatedTexture.parseItemTexCoord(item.subImg, mapManager.game.getObjectTexture(item.tex), gl);
}

Item.prototype.draw = function(){
	var game = this.mapManager.game;
	game.drawBillboard(this.position,this.textureCode,this.billboard);
};

Item.prototype.loop = function(){
	this.draw();
};