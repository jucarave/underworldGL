var AnimatedTexture = {
	_1Frame: [],
	_3Frames: [],
	_4Frames: [],
	
	init: function(gl){
		// 1 Frame
		var coords = [1.0,1.0,0.0,1.0,1.0,0.00,0.00,0.00];
		this._1Frame.push(this.prepareBuffer(coords, gl));
		
		// 3 Frames, 4 Frames
		var coords;
		coords = [0.25,1.00,0.00,1.00,0.25,0.00,0.00,0.00];
		this._3Frames.push(this.prepareBuffer(coords, gl));
		this._4Frames.push(this.prepareBuffer(coords, gl));
		coords = [0.50,1.00,0.25,1.00,0.50,0.00,0.25,0.00];
		this._3Frames.push(this.prepareBuffer(coords, gl));
		this._4Frames.push(this.prepareBuffer(coords, gl));
		coords = [0.75,1.00,0.50,1.00,0.75,0.00,0.50,0.00];
		this._3Frames.push(this.prepareBuffer(coords, gl));
		this._4Frames.push(this.prepareBuffer(coords, gl));
		coords = [1.00,1.00,0.75,1.00,1.00,0.00,0.75,0.00];
		this._4Frames.push(this.prepareBuffer(coords, gl));
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
		if (numFrames == 1) return this._1Frame; else
		if (numFrames == 3) return this._3Frames; else
		if (numFrames == 4) return this._4Frames;
	}
};
