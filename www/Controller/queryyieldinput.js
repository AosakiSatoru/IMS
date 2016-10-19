var varList;

//params mark - Initalize
function viewInit() {
	$("#queryYieldInput_startTimeDatepicker1").kendoDatePicker({
		animation: false,
		culture: "zh-CN",
		format: "yyyy-MM-dd"
	});
	$("#queryYieldInput_startTimeDatepicker2").kendoDatePicker({
		animation: false,
		culture: "zh-CN",
		format: "yyyy-MM-dd"
	});
	$("#queryYieldInput_machine").kendoDropDownList({
		dataSource: [],
		dataTextField: "devcodename",
		dataValueField: "devcode"
	});
}

function viewShow() {
	varList = queryYieldInputFetchVarietiesDataRequest();
	console.log(varList);
	queryYieldInputFetchDevicesDataRequest();
}

//params mark - dealloc
$("#queryYieldInput_leftNavButton").click(function() {
	setTimeout(function() {
		$("#queryYieldInput_procedure-list").data("kendoPopup").destroy();
		$("#queryYieldInput_machine-list").data("kendoPopup").destroy();
		$("#duty-list").data("kendoPopup").destroy();
		$("#IMSQueryYieldInput").data("kendoMobileView").destroy();
		$("#IMSQueryYieldInput").remove();
	}, 550);
	app.navigate("#:", "overlay:left reverse");
});

//params mark - Interface
function queryYieldInputFetchDataRequest(params) {
	kendo.ui.progress($("#IMSQueryYieldInput"), true);
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
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			alert(JSON.stringify(data));
			showList(data);
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			alert("请求服务器出错");
		}
	});

}

function queryYieldInputModifyDataRequest(params) {
	alert(JSON.stringify(params));
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
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			alert("请求服务器出错");
		}
	});

}

function queryYieldInputFetchVarietiesDataRequest() {
	var result = [];
	kendo.ui.progress($("#IMSQueryYieldInput"), true);
	$.ajax({
		type: "post",
		url: IMSUrl + "findxjs/",
		async: false,
		dataType: "jsonp",
		data: null,
		dataType: "json",
		success: function(data) {
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			result = data.outputstr.map(function(item) {
				return {
					variety: item.XJS_No
				};
			});

		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			alert("请求服务器出错");
		}
	});
	return result;
}

function queryYieldInputFetchDevicesDataRequest() {
	kendo.ui.progress($("#IMSQueryYieldInput"), true);
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
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			var content = data.outputstr.flowcoderows;
			//			alert(JSON.stringify(content));
			for(var key in content) {
				var object = content[key];
				var contentArray = new Array();
				$.each(object.devices, function(n, device) {
					if(device.devcode.trim() != "" && device.devcode && device.devcodename.trim() != "" && device.devcodename) {
						var dropdownlist = $("#queryYieldInput_machine").data("kendoDropDownList");
						dropdownlist.dataSource.add({
							devcodename: device.devcodename.trim() + ":" + device.devcode.trim(),
							devcode: device.devcode.trim()
						});
						//						dropdownlist.search("A");
						dropdownlist.select(0);
					}
				});
			}
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			alert("请求服务器出错!原因:" + JSON.stringify(data));
		}
	});
}

//params mark - Action
$("#queryYieldInput_QueryButton").click(function() {
	var startDate = $("#queryYieldInput_startTimeDatepicker1").val();
	var endDate = $("#queryYieldInput_startTimeDatepicker2").val();
	if(endDate == "" || startDate == "") {
		alert("请输入完整日期");
		return;
	}

	var devcode = $("#queryYieldInput_machine").val();
	if(devcode == "" || !devcode) {
		alert("请选择设备");
		return;
	}

	var params;
	if($("#duty").val() == "0" && $("#queryYieldInput_procedure").val() == "0") {
		params = {
			"devcode": devcode,
			"startdate": startDate,
			"enddate": endDate,
		};
	} else if($("#duty").val() != "0" && $("#queryYieldInput_procedure").val() == "0") {
		params = {
			"duty": $("#duty").val(),
			"devcode": devcode,
			"startdate": startDate,
			"enddate": endDate,
		};
	} else if($("#duty").val() == "0" && $("#queryYieldInput_procedure").val() != "0") {
		params = {
			"flowcode": $("#queryYieldInput_procedure").val(),
			"devcode": devcode,
			"startdate": startDate,
			"enddate": endDate,
		};
	} else if($("#duty").val() != "0" && $("#queryYieldInput_procedure").val() != "0") {
		params = {
			"duty": $("#duty").val(),
			"flowcode": $("#queryYieldInput_procedure").val(),
			"devcode": devcode,
			"startdate": startDate,
			"enddate": endDate,
		};
	}
	
	alert(JSON.stringify(params));

	queryYieldInputFetchDataRequest(params);
});

function showList(data) {
	if(data.outstatus != 0) {
		alert(data.outputstr);
	} else if(data.outstatus == 0) {
		var category = new Array();
		dataArray = data.outputstr;
		$.each(dataArray, function(n, value) {
			var duty = "";
			if(value.duty.trim() == "1") duty = "甲";
			else if(value.duty.trim() == "2") duty = "乙";
			else if(value.duty.trim() == "3") duty = "丙";

			category.push({
				"recid": value.recid,
				"duty": duty,
				"flowname": value.flowname,
				"date": new Date(value.date).Format("yyyy-MM-dd hh:mm:ss"),
				"devname": value.devcode,
				"yield": value.yield,
				"variety": value.varieties
			});
		});

		alert(JSON.stringify(category));

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
				alert(JSON.stringify(params));
				queryYieldInputModifyDataRequest(params);

			},
			deleteItem: function(e) {
				var index = e.target.parent().index();
			}
		});
		kendo.bind($("#queryYieldInput_listview"), listViewModel);
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