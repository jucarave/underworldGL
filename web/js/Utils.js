function addEvent(obj, type, func){
	if (obj.addEventListener){
		obj.addEventListener(type, func, false);
	}else if (obj.attachEvent){
		obj.attachEvent("on" + type, func);
	}
}

function $$(objId){
	var elem = document.getElementById(objId);
	if (!elem) alert("Couldn't find element: " + objId);
	return elem;
}

Math.radRelation = Math.PI / 180;
Math.degToRad = function(degrees){
	return degrees * this.radRelation;
};

Math.PI_2 = Math.PI / 2;
Math.PI2 = Math.PI * 2;
Math.PI3_2 = Math.PI * 3 / 2;

window.requestAnimFrame = 
	window.requestAnimationFrame       || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function(/* function */ draw1){
		window.setTimeout(draw1, 1000 / 30);
	};

window.AudioContext = window.AudioContext || window.webkitAudioContext;