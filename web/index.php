<!DOCTYPE HTML>
<html>
	<head>
		<title>Underworld GL - Jucarave</title>
		
		<script type="text/javascript" src="js/Vec.js"></script>
		<script type="text/javascript" src="js/Utils.js"></script>
		<script type="text/javascript" src="js/ObjectFactory.js"></script>
		<script type="text/javascript" src="js/Matrix.js"></script>
		
		<script type="text/javascript" src="js/WebGL.js"></script>
		<script type="text/javascript" src="js/UI.js"></script>
		<script type="text/javascript" src="js/Underworld.js"></script>
		<script type="text/javascript" src="js/MapManager.js"></script>
		<script type="text/javascript" src="js/Player.js"></script>
		
		<script id="vertexShader" type="x-shader/x-vertex"><?php require("shaders/vertexShader"); ?></script>
		<script id="fragmentShader" type="x-shader/x-fragment"><?php require("shaders/fragmentShader"); ?></script>
	</head>
	
	<body>
		<div id="divGame" style="position:relative"></div>
	</body>
</html>