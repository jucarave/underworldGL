function Vec4(a, b, c, d){
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
}

Vec4.prototype.equals = function(a, b, c, d){
	if (c == undefined) c = 0;
	if (d == undefined) d = 0;
	
	if (arguments.length == 1){
		return (this.a == a.a && this.b == a.b && this.c == a.c && this.d == a.d);
	}else{
		return (this.a == a && this.b == b && this.c == c && this.d == d);
	}
};

Vec4.prototype.set = function(a, b, c, d){
	if (c == undefined) c = 0;
	if (d == undefined) d = 0;
	
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
};

function vec2(a, b){
	return new Vec4(a,b,0,0);
}

function vec3(a, b, c){
	return new Vec4(a,b,c,0);
}

function vec4(a, b, c, d){
	return new Vec4(a,b,c,d);
}