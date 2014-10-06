function Item(position, item, mapManager){
	var gl = mapManager.game.GL.ctx;
	
	this.position = position;
	this.item = item;
	this.mapManager = mapManager;
	this.billboard = ObjectFactory.billboard(vec3(1.0,1.0,1.0), vec2(1.0, 1.0), gl);
	
	this.textureCode = item.tex;
	this.billboard.texBuffer = AnimatedTexture.parseItemTexCoord(item.subImg, mapManager.game.getObjectTexture(item.tex), gl);
	
	this.destroyed = false;
}

Item.prototype.activate = function(){
	var game = this.mapManager.game;
	if (this.item.isItem){
		if (game.inventory.addItem(this.item)){
			game.console.addSFMessage(this.item.name + " picked.");
			this.destroyed = true;
		}else{
			game.console.addSFMessage("You can't carry any more items");
		}
	}
};

Item.prototype.draw = function(){
	if (this.destroyed) return;
	
	var game = this.mapManager.game;
	game.drawBillboard(this.position,this.textureCode,this.billboard);
};

Item.prototype.loop = function(){
	if (this.destroyed) return;
	this.draw();
};