//params mark - Initalize
function viewInit() {
	$("#queryPackingInput_startTimeDatepicker1").kendoDatePicker({
		animation: false,
		culture: "zh-CN",
		format: "yyyy-MM-dd"
	});

	$("#queryPackingInput_startTimeDatepicker2").kendoDatePicker({
		animation: false,
		culture: "zh-CN",
		format: "yyyy-MM-dd"
	});

	$("#queryPackingInput_yield").kendoDropDownList();
	$("#queryPackingInput_type").kendoDropDownList();

	var todayDate = kendo.toString(kendo.parseDate(new Date()), 'yyyy-MM-dd');
	$("#queryPackingInput_startTimeDatepicker1").data("kendoDatePicker").value(todayDate);
	$("#queryPackingInput_startTimeDatepicker2").data("kendoDatePicker").value(todayDate);
	
	var dataSource = kendo.data.DataSource.create({
		data: [{}],
	});

	var listViewModel = new kendo.observable({
		queryPackingInputCommonDataSource: dataSource,
	});
	kendo.bind($("#queryPackingInputCommonlistview"), listViewModel);
}

function viewShow() {
	
}

//params mark - Interface
function queryPackingInputFetchDataRequest(params) {

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
			setTimeout(function() {
				kendo.ui.progress($("#IMSQueryPackingInput"), false);
			}, 300);
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryPackingInput"), false);
			alert("请求服务器出错");
		}
	});

}

function queryPackingInputModifyDataRequest(params) {
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
			if(data.outstatus != 0) {
				alert(data.outputstr);
			} else if(data.outstatus == 0) {
				alert("修改成功");
			}
			kendo.ui.progress($("#IMSQueryPackingInput"), false);
		    $("#queryPackingInput_QueryButton").click();
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryPackingInput"), false);
			alert("请求服务器出错");
			 $("#queryPackingInput_QueryButton").click();
		}
	});

}

//params mark - Action
$("#queryPackingInput_QueryButton").click(function() {
	var params;

	var startDate = $("#queryPackingInput_startTimeDatepicker1").val()+" 00:00:00";
	var endDate = $("#queryPackingInput_startTimeDatepicker2").val()+" 23:59:59";
   
	if(endDate == "" || startDate == "") {
		alert("请输入完整日期");
		return;
	}
	kendo.ui.progress($("#IMSQueryPackingInput"), true);
	params = {
		"startdate": startDate,
		"enddate": endDate,
	};
	if($("#queryPackingInput_type").val() != "ALL") params.Type = $("#queryPackingInput_type").val();
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
				"unit": value.unit.trim(),
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
				var recid = e.target.parent().parent().find("#queryPackingInput_itemInfo").attr("recid");
				var unit = e.target.parent().find("#queryPackingInput_unit").val();
				var yield = e.target.parent().find("#queryPackingInput_yield").val();
				var params;
				params = {
					"recid": recid,
					"unit": unit,
					"yield": yield,
					"Dotype": "0" //0-修改
				};
				queryPackingInputModifyDataRequest(params);
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