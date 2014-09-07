var ObjectFactory = {
	cube: function(size, texRepeat, gl){
		var vertex, indices, texCoords;
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
			
			// Top Face
			 w,  h, -l,
			 w,  h,  l,
			-w,  h, -l,
			-w,  h,  l,
			
			// Botom Face
			 w, -h,  l,
			 w, -h, -l,
			-w, -h,  l,
			-w, -h, -l
		];
		
		indices = [];
		for (var i=0,len=vertex.length/3;i<len;i+=4){
			indices.push(i, i+1, i+2, i+1, i+2, i+3);
		}
		
		texCoords = [];
		for (var i=0;i<6;i++){
			texCoords.push(
				 tx, ty,
				 tx,0.0,
				0.0, ty,
				0.0,0.0
			);
		}
		
		// Creates the buffer data for the vertices
		var vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
		
		// Creates the buffer data for the texture coordinates
		var texBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
		
		// Creates the buffer data for the indices
		var indicesBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		
		return this.getObjectWithProperties(vertexBuffer, indicesBuffer, texBuffer);
	},
	
	getObjectWithProperties: function(vertexBuffer, indexBuffer, texBuffer){
		var obj = {
			rotation: vec3(0, 0, 0),
			position: vec3(0, 0, 0),
			vertexBuffer: vertexBuffer, 
			indicesBuffer: indexBuffer, 
			texBuffer: texBuffer
		};
		
		return obj;
	}
};
