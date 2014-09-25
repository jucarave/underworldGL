<?php
	$version = "A0.1";
	$environment = "LOCAL";
	$contextPath = "/underworldGL/web/";
	
	if ($environment == "SERVER"){
		$contextPath = "/games/underworldGL/"; 
		
		if ($_SERVER['HTTP_HOST'] == "games.jucarave.net" || $_SERVER['HTTP_HOST'] == "games.jucarave.com")
			$contextPath = "/underworldGL/";
	} 
?>