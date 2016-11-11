var varList;
var devList;

//params mark - Initalize
function viewInit() {
	kendo.ui.progress($("#IMSQueryYieldInput"), true);
	$("#queryYieldInput_startTimeDatepicker1").kendoDatePicker({
		animation: {
			open: {
				effects: "fadeIn",
				duration: 300
			},
			close: {
				effects: "fadeOut",
				duration: 300
			}
		},
		culture: "zh-CN",
		format: "yyyy-MM-dd"
	});
	$("#queryYieldInput_startTimeDatepicker2").kendoDatePicker({
		animation: {
			open: {
				effects: "fadeIn",
				duration: 300
			},
			close: {
				effects: "fadeOut",
				duration: 300
			}
		},
		culture: "zh-CN",
		format: "yyyy-MM-dd"
	});
	//	$("#queryYieldInput_machine").kendoDropDownList({
	//		dataSource: [],
	//		dataTextField: "devcodename",
	//		dataValueField: "devcode"
	//	});
	var todayDate = kendo.toString(kendo.parseDate(new Date()), 'yyyy-MM-dd');
	$("#queryYieldInput_startTimeDatepicker1").data("kendoDatePicker").value(todayDate);
	$("#queryYieldInput_startTimeDatepicker2").data("kendoDatePicker").value(todayDate);

	var dataSource = kendo.data.DataSource.create({
		data: [{}],
	});

	var listViewModel = new kendo.observable({
		queryYieldInputCommonDataSource: dataSource,
	});
	kendo.bind($("#queryYieldInputCommonlistview"), listViewModel);
}

function viewShow() {

}

function afterShow() {
	varList = queryYieldInputFetchVarietiesDataRequest();
	queryYieldInputFetchDevicesDataRequest();
}

//params mark - Interface
function queryYieldInputFetchDataRequest(params) {

	$.ajax({
		type: "post",
		url: IMSUrl + "Query_YieldInput/",
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
				showList(data);
			}
			setTimeout(function() {
				kendo.ui.progress($("#IMSQueryYieldInput"), false);
			}, 300);

		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			alert("请求服务器出错");
		}
	});

}

function queryYieldInputModifyDataRequest(params) {
	kendo.ui.progress($("#IMSQueryYieldInput"), true);
	$.ajax({
		type: "post",
		url: IMSUrl + "Modify_YieldInput/",
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
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			$("#queryYieldInput_QueryButton").click();
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			alert("请求服务器出错");
			$("#queryYieldInput_QueryButton").click();
		}
	});

}

function queryYieldInputFetchVarietiesDataRequest() {
	var result = [];
	//	kendo.ui.progress($("#IMSQueryYieldInput"), true);
	$.ajax({
		type: "post",
		url: IMSUrl + "findxjs/",
		async: false,
		dataType: "jsonp",
		data: null,
		dataType: "json",
		success: function(data) {
			//			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			result = data.outputstr.map(function(item) {
				return {
					variety: item.XJS_No
				};
			});

		},
		error: function(data, status, e) {
			//			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			alert("请求服务器出错");
		}
	});
	return result;
}

function queryYieldInputFetchDevicesDataRequest() {

	$.ajax({
		type: "post",
		url: IMSUrl + "busi_bindfind/",
		async: false,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify({
				"type": "1"
			})
		},
		dataType: "json",
		success: function(data) {
			devList = data.outputstr.flowcoderows;
			var devDropDownList = document.getElementById('queryYieldInput_machine');
			for(var key in devList) {
				var object = devList[key];
				//指定2、3、7工序
				if(object.flowcode == "2" || object.flowcode == "3" || object.flowcode == "7") {
					$.each(object.devices, function(n, device) {
						if(device.devcode.trim() != "" && device.devcode && device.devcodename.trim() != "" && device.devcodename) {
							devDropDownList.options.add(new Option(device.devcodename.trim(), device.devcode.trim()));
						}
					});
				}
			}
			setTimeout(function() {
				kendo.ui.progress($("#IMSQueryYieldInput"), false);
			}, 300);

		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			alert("请求服务器出错");
		}
	});
}

//params mark - Action
$("#queryYieldInput_QueryButton").click(function() {
	var startDate = $("#queryYieldInput_startTimeDatepicker1").val() + " 00:00:00";
	var endDate = $("#queryYieldInput_startTimeDatepicker2").val() + " 23:59:59";
	if(endDate == "" || startDate == "") {
		alert("请输入完整日期");
		return;
	}

	var devcode = $("#queryYieldInput_machine").val();
	if(devcode == "" || !devcode) {
		alert("请选择设备");
		return;
	}

	kendo.ui.progress($("#IMSQueryYieldInput"), true);
	var params;
	params = {
		"startdate": startDate,
		"enddate": endDate,
	};
	if($("#queryYieldInput_machine").val() != "ALL") params.devcode = devcode;
	if($("#duty").val() != "ALL") params.duty = $("#duty").val();
	if($("#queryYieldInput_procedure").val() != "ALL") params.flowcode = $("#queryYieldInput_procedure").val();

	queryYieldInputFetchDataRequest(params);
});

function showList(data) {

	var category = new Array();
	dataArray = data.outputstr;
	$.each(dataArray, function(n, value) {
		category.push({
			"recid": value.recid,
			"duty": value.duty,
			"flowname": value.flowname,
			"date": new Date(value.date).Format("yyyy-MM-dd hh:mm:ss"),
			"shiftdate": new Date(value.shiftdate).Format("yyyy-MM-dd"),
			"devname": value.devcode,
			"yield": value.yield,
			"variety": value.varieties
		});
	});

	var dataSource = kendo.data.DataSource.create({
		data: category,
	});
	var varietiesDataSource = kendo.data.DataSource.create({
		data: varList,
	});
	var listViewModel = new kendo.observable({
		queryResultDataSource: dataSource,
		varietiesDataSource: varietiesDataSource,
		editItem: function(e) {
			var index = e.target.parent().index();
			var duty = e.target.parent().find("#queryYieldInput_duty").val();
			var varieties = e.target.parent().find("#queryYieldInput_varieties").val();
			var yield = e.target.parent().find("#queryYieldInput_yield").val();
			var recid = e.target.parent().parent().find("#queryYieldInput_itemInfo").attr("recid");
			var params;
			params = {
				"recid": recid,
				"duty": duty,
				"yield": yield,
				"varieties": varieties,
				"Dotype": "0" //0-修改
			};
			queryYieldInputModifyDataRequest(params);

		}
	});
	kendo.bind($("#queryYieldInput_listview"), listViewModel);
}

function queryYieldInput_AutoFill(flowcode) {
	//清空设备选项
	var devDropDownList = document.getElementById('queryYieldInput_machine');
	devDropDownList.options.length = 0;
	devDropDownList.options.add(new Option("全部", "ALL"));
	//筛选设备选项
	for(var key in devList) {
		var object = devList[key];
		if(object.flowcode == flowcode || (flowcode == "ALL" && (object.flowcode == "2" || object.flowcode == "3" || object.flowcode == "7"))) {
			$.each(object.devices, function(n, device) {
				if(device.devcode.trim() != "" && device.devcode && device.devcodename.trim() != "" && device.devcodename) {
					//添加设备选项
					devDropDownList.options.add(new Option(device.devcodename.trim(), device.devcode.trim()));
				}
			});
		}
	}

}