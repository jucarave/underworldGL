var canvas2D, ctx2D, map, camera2D = {x: 0, y: 0};

$(document).ready(function(){
	$("#div2DView").height("100%");
	
	$("#navMenu").css("margin", 0);
	var menuH = $("#navMenu").outerHeight();
	var windowH = $(window).height();
	
	$("#renderDiv").height(windowH - menuH - 3);
	
	initMap();
	init2DEditor();
	init2DEvents();
	drawGrid();
});

function init2DEditor(){
	canvas2D = $("#cnv2DEditor")[0];
	ctx2D = canvas2D.getContext("2d");
	ctx2D.width = canvas2D.width;
	ctx2D.height = canvas2D.height;
	
	clearCanvas();
}

function initMap(){
	map = [];
	for (var y=0;y<64;y++){
		map[y] = [];
		for (var x=0;x<64;x++){
			map[y][x] = 0;
		}
	}
}

function clearCanvas(){
	ctx2D.fillStyle = "#181F42";
	ctx2D.fillRect(0,0,ctx2D.width,ctx2D.height);
}

function drawGrid(){
	ctx2D.strokeStyle = "#3d456e";
	ctx2D.setLineDash([5]);
	
	var ww = 64 * 32;
	for (var i=0;i<=64;i++){
		xx = i*32;
		ctx2D.beginPath();
		ctx2D.moveTo(camera2D.x + xx,camera2D.y);
		ctx2D.lineTo(camera2D.x + xx,camera2D.y + ww);
		ctx2D.stroke();
		
		ctx2D.beginPath();
		ctx2D.moveTo(camera2D.x,camera2D.y + xx);
		ctx2D.lineTo(camera2D.x + ww,camera2D.y + xx);
		ctx2D.stroke();
	}
}

var dragging = false, anchor = {x: 0, y: 0};
function init2DEvents(){
	$(canvas2D).bind("mousedown", function(e){
		if (window.event) e = window.event;
		if (e.button == 1){ // Wheel
			dragging = true;
			anchor.x = e.clientX;
			anchor.y = e.clientY;
		}
		
		e.preventDefault();
		e.cancelBubble = true;
		return false;
	});
	
	$(document).bind("mouseup", function(e){
		if (e.button == 1){ // Wheel
			dragging = false;
			anchor = {x: 0, y: 0};
		}
		
		e.preventDefault();
		e.cancelBubble = true;
		return false;
	});
	
	$(document).bind("mousemove", function(e){
		if (window.event) e = window.event;
		
		if (dragging){
			var xx = e.clientX - anchor.x;
			var yy = e.clientY - anchor.y;
			
			anchor.x = e.clientX;
			anchor.y = e.clientY;
			
			camera2D.x += xx;
			camera2D.y += yy;
			
			clearCanvas();
			drawGrid();
			
			e.preventDefault();
			e.cancelBubble = true;
			return false;
		}
	});
}
