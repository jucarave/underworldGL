<?php
	$version = "A0.3";
	$environment = "SERVER";
	$contextPath = "/underworldGL/";
	
	if ($environment == "SERVER"){
		$contextPath = "/games/underworldGL/"; 
		
		if ($_SERVER['HTTP_HOST'] == "games.jucarave.net" || $_SERVER['HTTP_HOST'] == "games.jucarave.com")
			$contextPath = "/underworldGL/";
	} 
?>