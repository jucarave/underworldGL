function UI(size, container){
	this.initCanvas(size, container);
}

UI.prototype.initCanvas = function(size, container){
	var canvas = document.createElement("canvas");
	canvas.width = size.a;
	canvas.height = size.b;
	
	canvas.style.position = "absolute";
	canvas.style.top = 0;
	canvas.style.height = "100%";
	
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	container.appendChild(this.canvas);
};

UI.prototype.clear = function(){
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};
