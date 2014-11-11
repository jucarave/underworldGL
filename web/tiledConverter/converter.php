<?php
	function createTile($w, $y, $h, $c, $f, $ch, $dw, $aw, $sl, $dir){
		global $globTiles;
		
		for ($i=1;$i<sizeof($globTiles);$i++){
			$tile = $globTiles[$i];
			
			if ($tile->{"w"} == $w && $tile->{"y"} == $y && $tile->{"h"} == $h && $tile->{"c"} == $c && $tile->{"f"} == $f && $tile->{"ch"} == $ch && $tile->{"dw"} == $dw && $tile->{"aw"} == $aw && $tile->{"sl"} == $sl && $tile->{"dir"} == $dir){
				return $i;
			}
		}
		
		$tile = new stdClass();
		$tile->{"w"} = $w;
		$tile->{"y"} = $y;
		$tile->{"h"} = $h;
		$tile->{"c"} = $c;
		$tile->{"f"} = $f;
		$tile->{"ch"} = $ch;
		$tile->{"dw"} = $dw;
		$tile->{"aw"} = $aw;
		$tile->{"sl"} = $sl;
		$tile->{"dir"} = $dir;
		
		$ind = sizeof($globTiles);
		$globTiles[$ind] = $tile;
		
		return $ind;
	}
	
	// Global tiles
	$result = new stdClass();
	$globTiles = array(null);
	$globObjects = array();
	
	// Create the empty map
	$rMap = array();
	for ($i=0;$i<64;$i++){
		$rMap[$i] = array();
		for ($j=0;$j<64;$j++){
			$rMap[$i][$j] = 0;
		}
	}
	
	// Load the file
	$file = file_get_contents("map.json");
	$jsonMap = json_decode($file);
	$layers = $jsonMap->{"layers"};
	
	$emptyObj = new stdClass();
	
	// Parse the map
	for ($y=0;$y<64;$y++){
		for ($x=0;$x<64;$x++){
			$tile = 0;
			
			// Properties of the tile
			$bu_w = 0;		// Texture of Wall
			$bu_y = 0;		// Position y
			$bu_h = 1;		// Height of tile
			$bu_c = 0;		// Texture of ceil
			$bu_f = 0;		// Texture of floor
			$bu_ch = 1;		// Position of ceil
			$bu_dw = 0;		// Diagonal Wall Texture
			$bu_aw = 0;		// Angle of Diagonal Wall
			$bu_sl = 0;		// Texture of slope
			$bu_dir = 0;	// Direction of slope
			
			$noTile = true;
			foreach ($layers as $l){
				if (isset($l->{"data"})){
					$data = $l->{"data"};
					$properties = $emptyObj;
					if (isset($l->{"properties"})) $properties = $l->{"properties"};
					$t = $data[$x + ($y * 64)];
					if ($t != 0){
						$noTile = false;
						
						$typeof = $t % 16;
						if ($typeof == 1){ // Wall tile
							$bu_w = floor($t / 16) + 1;
						}else if ($typeof >= 2 && $typeof <= 5){ // Angled Wall tile
							$bu_dw = floor($t / 16) + 1;
							$bu_aw = $typeof - 2;
						}else if ($typeof == 6){ // Floor tile
							$bu_f = floor($t / 16) + 1;
						}else if ($typeof >= 7 && $typeof <= 10){ // Slope tile
							$bu_sl = floor($t / 16) + 1;
							$bu_dir = $typeof - 7;
						}else if ($typeof == 11){ // Ceil tile
							$bu_c = floor($t / 16) + 1;
						}
						
						if (isset($properties->{"y"})) $bu_y = (real)$properties->{"y"};
						if (isset($properties->{"height"})) $bu_h = (real)$properties->{"height"};
						if (isset($properties->{"ceil_y"})) $bu_ch = (real)$properties->{"ceil_y"};
					}
				}else if (isset($l->{"objects"})){
					$objects = $l->{"objects"};
					foreach ($objects as $o){
						$o_x = floor(((real)$o->{"x"}) / 16);
						$o_y = floor(((real)$o->{"y"}) / 16);
						
						$obj = new stdClass();
						$obj->{"x"} = $o_x;
						$obj->{"z"} = $o_y - 1;
						
						$properties = $o->{"properties"};
						$type = $o->{"type"};
						
						$obj->{"y"} = (isset($properties->{"z"}))? (real)$properties->{"z"} : 0;
						switch ($type){
							case "player":
								$o_dir = (real)$properties->{"direction"};
								
								$obj->{"dir"} = $o_dir;
								$obj->{"type"} = "player";
								$globObjects[sizeof($globObjects)] = $obj;
							break;
						}
					}
				}
			}
			
			if (!$noTile){
				$ind = createTile($bu_w, $bu_y, $bu_h, $bu_c, $bu_f, $bu_ch, $bu_dw, $bu_aw, $bu_sl, $bu_dir);
				$rMap[$y][$x] = $ind;
			}
		}
	}
	
	// Print the result map
	$result->{"tiles"} = $globTiles;
	$result->{"objects"} = $globObjects;
	$result->{"map"} = $rMap;
	echo json_encode($result);
?>