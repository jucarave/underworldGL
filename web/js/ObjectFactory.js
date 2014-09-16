var ObjectFactory = {
	normals: {
		down:  vec2( 0, 1),
		right: vec2( 1, 0),
		up:    vec2( 0,-1),
		left:  vec2(-1, 0),
		
		upRight:  vec2(Math.cos(Math.degToRad(45)), -Math.sin(Math.degToRad(45))),
		upLeft:  vec2(-Math.cos(Math.degToRad(45)), -Math.sin(Math.degToRad(45))),
		downRight:  vec2(Math.cos(Math.degToRad(45)), Math.sin(Math.degToRad(45))),
		downLeft:  vec2(-Math.cos(Math.degToRad(45)), Math.sin(Math.degToRad(45)))
	},
	
	angledWall: function(size, texRepeat, gl){
		var vertex, indices, texCoords, darkVertex;
		var w = size.a / 2;
		var h = size.b / 2;
		var l = size.c / 2;
		
		var tx = texRepeat.a;
		var ty = texRepeat.b;
		
		vertex = [
			// Front Face
			 w,  h, -l,
			 w, -h, -l,
			-w,  h,  l,
			-w, -h,  l,
			
			// Back Face
			-w,  h,  l,
			-w, -h,  l,
			 w,  h,  l,
			 w, -h,  l,
			 
			// Right Face
			 w,  h,  l,
			 w, -h,  l,
			 w,  h, -l,
			 w, -h, -l
		];
		
		indices = [];
		for (var i=0,len=vertex.length/3;i<len;i+=4){
			indices.push(i, i+1, i+2, i+2, i+1, i+3);
		}
		
		texCoords = [];
		for (var i=0;i<3;i++){
			texCoords.push(
				 tx, ty,
				 tx,0.0,
				0.0, ty,
				0.0,0.0
			);
		}
		
		darkVertex = [];
		for (var i=0;i<12;i++){
			darkVertex.push(0);
		}
		
		// Creates the buffer data for the vertices
		var vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
		vertexBuffer.numItems = vertex.length;
		vertexBuffer.itemSize = 3;
		
		// Creates the buffer data for the texture coordinates
		var texBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		texBuffer.numItems = texCoords.length;
		texBuffer.itemSize = 2;
		
		// Creates the buffer data for the indices
		var indicesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		indicesBuffer.numItems = indices.length;
		indicesBuffer.itemSize = 1;
		
		var darkBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, darkBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,new Uint8Array(darkVertex), gl.STATIC_DRAW);
		darkBuffer.numItems = darkBuffer.length;
		darkBuffer.itemSize = 1;
		
		return this.getObjectWithProperties(vertexBuffer, indicesBuffer, texBuffer, darkBuffer);
	},
	
	cube: function(size, texRepeat, gl){
		var vertex, indices, texCoords, darkVertex;
		var w = size.a / 2;
		var h = size.b / 2;
		var l = size.c / 2;
		
		var tx = texRepeat.a;
		var ty = texRepeat.b;
		
		vertex = [
			// Front Face
			 w,  h, -l,
			 w, -h, -l,
			-w,  h, -l,
			-w, -h, -l,
			
			// Back Face
			-w,  h,  l,
			-w, -h,  l,
			 w,  h,  l,
			 w, -h,  l,
			 
			// Right Face
			 w,  h,  l,
			 w, -h,  l,
			 w,  h, -l,
			 w, -h, -l,
			 
			// Left Face
			-w,  h, -l,
			-w, -h, -l,
			-w,  h,  l,
			-w, -h,  l,
		];
		
		indices = [];
		for (var i=0,len=vertex.length/3;i<len;i+=4){
			indices.push(i, i+1, i+2, i+2, i+1, i+3);
		}
		
		texCoords = [];
		for (var i=0;i<4;i++){
			texCoords.push(
				 tx, ty,
				 tx,0.0,
				0.0, ty,
				0.0,0.0
			);
		}
		
		darkVertex = [];
		for (var i=0;i<16;i++){
			if (i < 8) darkVertex.push(1); else darkVertex.push(0);
		}
		
		// Creates the buffer data for the vertices
		var vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
		vertexBuffer.numItems = vertex.length;
		vertexBuffer.itemSize = 3;
		
		// Creates the buffer data for the texture coordinates
		var texBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		texBuffer.numItems = texCoords.length;
		texBuffer.itemSize = 2;
		
		// Creates the buffer data for the indices
		var indicesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		indicesBuffer.numItems = indices.length;
		indicesBuffer.itemSize = 1;
		
		var darkBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, darkBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,new Uint8Array(darkVertex), gl.STATIC_DRAW);
		darkBuffer.numItems = darkBuffer.length;
		darkBuffer.itemSize = 1;
		
		return this.getObjectWithProperties(vertexBuffer, indicesBuffer, texBuffer, darkBuffer);
	},
	
	floor: function(size, texRepeat, gl){
		var vertex, indices, texCoords;
		var w = size.a / 2;
		var h = size.b / 2;
		var l = size.c / 2;
		
		var tx = texRepeat.a;
		var ty = texRepeat.b;
		
		vertex = [
			 w, 0.0,  l,
			 w, 0.0, -l,
			-w, 0.0,  l,
			-w, 0.0, -l,
		];
		
		indices = [];
		indices.push(0, 1, 2, 2, 1, 3);
		
		texCoords = [];
		texCoords.push(
			 tx, ty,
			 tx,0.0,
			0.0, ty,
			0.0,0.0
		);
		
		darkVertex = [0,0,0,0];
		
		// Creates the buffer data for the vertices
		var vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
		vertexBuffer.numItems = vertex.length;
		vertexBuffer.itemSize = 3;
		
		// Creates the buffer data for the texture coordinates
		var texBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		texBuffer.numItems = texCoords.length;
		texBuffer.itemSize = 2;
		
		// Creates the buffer data for the indices
		var indicesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		indicesBuffer.numItems = indices.length;
		indicesBuffer.itemSize = 1;
		
		var darkBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, darkBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,new Uint8Array(darkVertex), gl.STATIC_DRAW);
		darkBuffer.numItems = darkBuffer.length;
		darkBuffer.itemSize = 1;
		
		return this.getObjectWithProperties(vertexBuffer, indicesBuffer, texBuffer, darkBuffer);
	},
	
	ceil: function(size, texRepeat, gl){
		var vertex, indices, texCoords;
		var w = size.a / 2;
		var h = size.b / 2;
		var l = size.c / 2;
		
		var tx = texRepeat.a;
		var ty = texRepeat.b;
		
		vertex = [
			 w, 0.0,  l,
			 w, 0.0, -l,
			-w, 0.0,  l,
			-w, 0.0, -l,
		];
		
		indices = [];
		indices.push(0, 2, 1, 1, 2, 3);
		
		texCoords = [];
		texCoords.push(
			 tx, ty,
			 tx,0.0,
			0.0, ty,
			0.0,0.0
		);
		
		darkVertex = [0,0,0,0];
		
		// Creates the buffer data for the vertices
		var vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
		vertexBuffer.numItems = vertex.length;
		vertexBuffer.itemSize = 3;
		
		// Creates the buffer data for the texture coordinates
		var texBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		texBuffer.numItems = texCoords.length;
		texBuffer.itemSize = 2;
		
		// Creates the buffer data for the indices
		var indicesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		indicesBuffer.numItems = indices.length;
		indicesBuffer.itemSize = 1;
		
		var darkBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, darkBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,new Uint8Array(darkVertex), gl.STATIC_DRAW);
		darkBuffer.numItems = darkBuffer.length;
		darkBuffer.itemSize = 1;
		
		return this.getObjectWithProperties(vertexBuffer, indicesBuffer, texBuffer, darkBuffer);
	},
	
	getObjectWithProperties: function(vertexBuffer, indexBuffer, texBuffer, darkBuffer){
		var obj = {
			rotation: vec3(0, 0, 0),
			position: vec3(0, 0, 0),
			vertexBuffer: vertexBuffer, 
			indicesBuffer: indexBuffer, 
			texBuffer: texBuffer,
			darkBuffer: darkBuffer
		};
		
		return obj;
	},
	
	doorWall: function(size, texRepeat, gl){
		var vertex, indices, texCoords, darkVertex;
		var w = size.a / 2;
		var h = size.b / 2;
		var l = size.c * 0.05;
		
		var w2 = -size.a * 0.25;
		var w3 = size.a * 0.25;
		
		var h2 = size.b * 0.25;
		
		var tx = texRepeat.a;
		var ty = texRepeat.b;
		
		vertex = [
			// Right part of the door
			// Front Face
			w2,  h, -l,
			w2, -h, -l,
			-w,  h, -l,
			-w, -h, -l,
			
			// Back Face
			-w,  h,  l,
			-w, -h,  l,
			w2,  h,  l,
			w2, -h,  l,
			 
			// Right Face
			w2,  h,  l,
			w2, -h,  l,
			w2,  h, -l,
			w2, -h, -l,
			
			// Left part of the door
			// Front Face
			 w,  h, -l,
			 w, -h, -l,
			w3,  h, -l,
			w3, -h, -l,
			
			// Back Face
			w3,  h,  l,
			w3, -h,  l,
			 w,  h,  l,
			 w, -h,  l,
			 
			// Left Face
			w3,  h, -l,
			w3, -h, -l,
			w3,  h,  l,
			w3, -h,  l,
			
			// Middle part of the door
			// Front Face
			w3,  h, -l,
			w3, h2, -l,
			w2,  h, -l,
			w2, h2, -l,
			
			// Back Face
			w2,  h,  l,
			w2, h2,  l,
			w3,  h,  l,
			w3, h2,  l,
			 
			// Bottom Face
			w3, h2, -l,
			w3, h2,  l,
			w2, h2, -l,
			w2, h2,  l,
		];
		
		indices = [];
		for (var i=0,len=vertex.length/3;i<len;i+=4){
			indices.push(i, i+1, i+2, i+2, i+1, i+3);
		}
		
		texCoords = [];
		for (var i=0;i<6;i++){
			texCoords.push(
				0.25, ty,
				0.25,0.0,
				0.00, ty,
				0.00,0.0
			);
		}
		for (var i=0;i<3;i++){
			texCoords.push(
				0.5,1.0,
				0.5,0.75,
				0.0,1.0,
				0.0,0.75
			);
		}
		
		darkVertex = [];
		for (var i=0;i<36;i++){
			darkVertex.push(0);
		}
		
		// Creates the buffer data for the vertices
		var vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
		vertexBuffer.numItems = vertex.length;
		vertexBuffer.itemSize = 3;
		
		// Creates the buffer data for the texture coordinates
		var texBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		texBuffer.numItems = texCoords.length;
		texBuffer.itemSize = 2;
		
		// Creates the buffer data for the indices
		var indicesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		indicesBuffer.numItems = indices.length;
		indicesBuffer.itemSize = 1;
		
		var darkBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, darkBuffer);
		gl.bufferData(gl.ARRAY_BUFFER,new Uint8Array(darkVertex), gl.STATIC_DRAW);
		darkBuffer.numItems = darkBuffer.length;
		darkBuffer.itemSize = 1;
		
		return this.getObjectWithProperties(vertexBuffer, indicesBuffer, texBuffer, darkBuffer);
	}
};
