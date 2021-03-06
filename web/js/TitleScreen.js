function TitleScreen(/*Game*/ game){
	this.game = game;
	this.blink = 30;
	
	this.game.playMusic("title");
}

TitleScreen.prototype.step = function(){
	if (this.game.getKeyPressed(13) || this.game.getMouseButtonPressed()){
		this.game.loadMap("test");
		this.game.scene = null;
		this.game.playMusic("britannian");
	}
};

TitleScreen.prototype.loop = function(){
	this.step();
	
	var ui = this.game.getUI();
	ui.drawImage(this.game.images.titleScreen, 0, 0);
	
	if (this.blink-- > 15){
		ui.font = this.game.font;
		ui.fillStyle = "white";
		ui.textAlign = "center";
		ui.fillText("Click To Continue", ui.width / 2, 88);
		ui.textAlign = "left";
	}else if (this.blink == 0){
		this.blink = 30;
	}
};
