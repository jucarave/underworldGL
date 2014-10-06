var ItemFactory = {
	items: {
		key: {code: "key", name: "Gold key", tex: "items", subImg: vec2(0,0), stack: false},
	},
	
	getItemByCode: function(itemCode, amount){
		if (!ItemFactory.items[itemCode]) throw "Invalid Item code: " + itemCode;
		
		var item = ItemFactory.items[itemCode];
		var ret = {};
		for (var i in item){
			ret[i] = item[i];
		}
		
		ret.amount = amount;
		ret.isItem = true;
		
		return ret;
	}
};
