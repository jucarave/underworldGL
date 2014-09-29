var ItemFactory = {
	key: {code: "key", tex: "items", subImg: vec2(0,0), stack: true},
	
	getItemByCode: function(itemCode, amount){
		if (!ItemFactory[itemCode]) throw "Invalid Item code: " + itemCode;
		
		var item = ItemFactory[itemCode];
		var ret = {};
		for (var i in item){
			ret[i] = item[i];
		}
		
		ret.amoutn = amount;
		
		return ret;
	}
};
