<?php
	$version = "0.1";
	$environment = "LOCAL";
	$contextPath = "/underworldGL/web/";
	
	if ($environment == "SERVER"){
		$contextPath = "/games/underworldGL/"; 
		
		if ($_SERVER['HTTP_HOST'] == "games.jucarave.net")
			$contextPath = "/underworldGL/";
	} 
?>