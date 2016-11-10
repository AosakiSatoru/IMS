//params mark - 全局方法
Date.prototype.Format = function(fmt) { //author: meizz  
	var o = {
		"M+": this.getMonth() + 1, //月份  
		"d+": this.getDate(), //日  
		"h+": this.getHours(), //小时  
		"m+": this.getMinutes(), //分  
		"s+": this.getSeconds(), //秒  
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度  
		"S": this.getMilliseconds() //毫秒  
	};
	if(/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

function GLOBAL_onlyNum(value) {
	if(!(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39))
		if(!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)))
			event.returnValue = false;
		//数字长度限制6位
	if(value.length > 5 && !(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39)) {
		event.returnValue = false;
	}
};

function GLOBAL_EnterDisable() {
	event.returnValue = false;
};