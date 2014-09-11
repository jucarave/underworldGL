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
		<script type="text/javascript" src="js/TitleScreen.js"></script>
		
		<script id="vertexShader" type="x-shader/x-vertex"><?php require("shaders/vertexShader"); ?></script>
		<script id="fragmentShader" type="x-shader/x-fragment"><?php require("shaders/fragmentShader"); ?></script>
		
		<style>
			body{ background-color: black; }
			#divGame {
				left: 0px;
				top: 0px;
				width: 100%;
				height: 100%;
				text-align: center;
				position: absolute;
			}
			
			canvas{ 
				left: 0px;
				right: 0px;
				margin: auto; 
			}
		</style>
	</head>
	
	<body>
		<div id="divGame" ></div>
	</body>
</html>