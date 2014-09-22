var AnimatedTexture = {
	_3Frames: [],
	
	init: function(gl){
		// 3 Frames
		var coords;
		coords = [0.25,1.00,0.00,1.00,0.25,0.00,0.00,0.00];
		this._3Frames.push(this.prepareBuffer(coords, gl));
		coords = [0.50,1.00,0.25,1.00,0.50,0.00,0.25,0.00];
		this._3Frames.push(this.prepareBuffer(coords, gl));
		coords = [0.75,1.00,0.50,1.00,0.75,0.00,0.50,0.00];
		this._3Frames.push(this.prepareBuffer(coords, gl));
	},
	
	prepareBuffer: function(coords, gl){
		var texBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
		texBuffer.numItems = coords.length;
		texBuffer.itemSize = 2;
		
		return texBuffer;
	},
	
	getByNumFrames: function(numFrames){
		if (numFrames == 3) return this._3Frames;
	}
};