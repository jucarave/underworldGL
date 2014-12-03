<?php
	$version = "A0.4";
	$environment = "LOCAL";
	$contextPath = "/underworldGL/";
	
	if ($environment == "SERVER"){
		$contextPath = "/games/underworldGL/"; 
		
		if ($_SERVER['HTTP_HOST'] == "games.jucarave.net" || $_SERVER['HTTP_HOST'] == "games.jucarave.com")
			$contextPath = "/underworldGL/";
	} 
?>