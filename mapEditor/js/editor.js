$(document).ready(function(){
	$("#navMenu").css("margin", 0);
	var menuH = $("#navMenu").outerHeight();
	var windowH = $(window).height();
	
	$("#renderDiv").height(windowH - menuH);
});
