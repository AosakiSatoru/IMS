//params mark - Initalize
function viewInit() {
	$("#queryPackingInput_startTimeDatepicker1").kendoDatePicker({
		animation: {
			close: {
				effects: "fadeOut zoom:out",
				duration: 300
			},
			open: {
				effects: "fadeIn zoom:in",
				duration: 300
			}
		},
		culture: "zh-CN",
		format: "yyyy-MM-dd"
	});

	$("#queryPackingInput_startTimeDatepicker2").kendoDatePicker({
		animation: {
			close: {
				effects: "fadeOut zoom:out",
				duration: 300
			},
			open: {
				effects: "fadeIn zoom:in",
				duration: 300
			}
		},
		culture: "zh-CN",
		format: "yyyy-MM-dd"
	});

	$("#queryPackingInput_yield").kendoDropDownList();
	$("#queryPackingInput_type").kendoDropDownList();
}

function viewShow() {

}

//params mark - Interface
function queryPackingInputFetchDataRequest(params) {
	kendo.ui.progress($("#IMSQueryPackingInput"), true);
	$.ajax({
		type: "post",
		url: IMSUrl + "Query_PackingInput/",
		async: false,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify(params)
		},
		dataType: "json",
		success: function(data) {
			showList(data);
			kendo.ui.progress($("#IMSQueryPackingInput"), false);
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryPackingInput"), false);
			alert("请求服务器出错");
		}
	});

}

function queryPackingInputModifyDataRequest(params) {
	alert(JSON.stringify(params));
	kendo.ui.progress($("#IMSQueryPackingInput"), true);
	$.ajax({
		type: "post",
		url: IMSUrl + "Modify_PackingInput",
		async: false,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify(params)
		},
		dataType: "json",
		success: function(data) {
			alert(JSON.stringify(data));
			kendo.ui.progress($("#IMSQueryPackingInput"), false);
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryPackingInput"), false);
			alert("请求服务器出错");
		}
	});

}

//params mark - Action
$("#queryPackingInput_QueryButton").click(function() {
	var params;
	var Type = "";
	if($("#queryPackingInput_type").val() == "回条") Type = "0";
	else if($("#queryPackingInput_type").val() == "粗纱头") Type = "1";
	else if($("#queryPackingInput_type").val() == "白花") Type = "2";

	if($("#queryPackingInput_type").val() == "全部") {
		params = {
			"startdate": $("#queryPackingInput_startTimeDatepicker1").val(),
			"enddate": $("#queryPackingInput_startTimeDatepicker2").val(),
		};
	} else {
		params = {
			"Type": Type,
			"startdate": $("#queryPackingInput_startTimeDatepicker1").val(),
			"enddate": $("#queryPackingInput_startTimeDatepicker2").val(),
		};
	}
	queryPackingInputFetchDataRequest(params);
});

function showList(data) {

	if(data.outstatus != 0) {
		alert(data.outputstr);
	} else if(data.outstatus == 0) {
		var category = new Array();
		dataArray = data.outputstr;
		$.each(dataArray, function(n, value) {
			var type;
			if(value.type == "0") type = "回条";
			else if(value.type == "1") type = "粗纱头";
			else if(value.type == "2") type = "白花";
			else type = "";
			category.push({
				"recid": value.recid,
				"Type": type,
				"date": new Date(value.date).Format("yyyy-MM-dd hh:mm:ss"),
				"unit": value.unit,
				"yield": value.yield
			});
		});

		var dataSource = kendo.data.DataSource.create({
			data: category,
		});

		var listViewModel = new kendo.observable({
			queryResultDataSource: dataSource,
			editItem: function(e) {
				var index = e.target.parent().index();
				var recid = e.target.parent().find("#queryPackingInput_itemInfo").attr("recid");
				var unit = e.target.parent().find("#queryPackingInput_unit").val();
				var yield = e.target.parent().find("#queryYieldInput_yield").val();
				var params;
				params = {
					"recid": recid,
					"unit": unit,
					"yield": yield,
					"Dotype": "0" //0-修改
				};
				queryPackingInputModifyDataRequest(params);
			},
			deleteItem: function(e) {
				var index = e.target.parent().index();
			}
		});
		kendo.bind($("#queryPackingInput_listview"), listViewModel);
	}
}

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