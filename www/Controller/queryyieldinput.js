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
}

function viewShow() {
	$.ajax({
		type: "post",
		url: IMSUrl + "busi_bindfind/",
		async: true,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify({
				"type": "1"
			})
		},
		dataType: "json",
		success: function(data) {
			kendo.mobile.application.hideLoading();
			bindView(data);
		},
		error: function(data, status, e) {
			kendo.mobile.application.hideLoading();
			alert("请求服务器出错!原因:" + JSON.stringify(data));
		}
	});
}

//params mark - Interface
function queryYieldInputFetchDataRequest(params) {
	alert(JSON.stringify(params));
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
			alert(JSON.stringify(data));
			showList(data);
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
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
			alert(JSON.stringify(data));
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSQueryYieldInput"), false);
			alert("请求服务器出错");
		}
	});

}

//params mark - Action
$("#queryYieldInput_QueryButton").click(function() {
	var params;
	params = {
		"duty": $("#duty").val(),
		"flowcode": $("#queryYieldInput_procedure").val(),
		"devcode": $("#queryYieldInput_machine").val(),
		"startdate": $("#queryYieldInput_startTimeDatepicker1").val(),
		"enddate": $("#queryYieldInput_startTimeDatepicker2").val(),
	};
	queryYieldInputFetchDataRequest(params);
});

function showList(data) {
	if(data.outstatus != 0) {
		alert(data.outputstr);
	} else if(data.outstatus == 0) {
		//				alert(JSON.stringify(data.outputstr.Listrow));
		var category = new Array();
		dataArray = data.outputstr.Listrow;
		$.each(dataArray, function(n, value) {
			category.push({
				"recid": value.recid,
				"duty": value.duty,
				"flowname": value.flowname,
				"date": value.date,
				"devname": value.devname,
				"yield": value.yield,
				"varieties": value.varieties
			});
		});

		var dataSource = kendo.data.DataSource.create({
			data: category,
		});

		var listViewModel = new kendo.observable({
			queryResultDataSource: dataSource,
			editItem: function(e) {

				var index = e.target.parent().index();
				var duty = e.target.parent().find("#queryYieldInput_duty").val();
				var varieties = e.target.parent().find("#queryYieldInput_varieties").val();
				var yield = e.target.parent().find("#queryYieldInput_yield").val();
				var recid = e.target.parent().find("#queryYieldInput_itemInfo").attr("recid");
				var params;
				params = {
					"recid": recid,
					"duty": duty,
					"yield": yield,
					"varieties": varieties,
					"Dotype": "0" //0-修改
				};
				queryYieldInputModifyDataRequest(params);

			},
			deleteItem: function(e) {
				var index = e.target.parent().index();
			}
		});
		kendo.bind($("#queryYieldInput_listview"), listViewModel);
	}
}