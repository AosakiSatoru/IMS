var type = "0";

function postPackingInputData() {
	var typerows = [{
		"unit": $("#packingInput_dropdownlist").val(),
		"yield": $("#IMSPackingInput_yield").val(),
		"shiftdate": $("#time").val(),
		"type": type
	}];
	var para = {
		"typerows": typerows,
		"username": storage.get("srcid"),
	};
	if($("#IMSPackingInput_yield").val().length == 0) {
		alert("请输入数量");
		return;
	}

	var url = IMSUrl + "busi_PackingInput/";
	if(!isOnline) {

		saveOfflineInfo(para);
		return;
	}
	kendo.ui.progress($("body"), true);
	$.ajax({
		type: "post",
		url: url,
		timeout: 10000,
		async: true,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify(para)
		},
		dataType: "json",
		success: function(data) {
			kendo.ui.progress($("body"), false);
			if(data.outstatus == 0) {
				alert("处理成功");
				$("#IMSPackingInput_yield").val("");
			}
			else
				alert("操作失败，请稍后再试");
		},
		error: function(data, status, e) {
			kendo.ui.progress($("body"), false);
			if(e == "timeout") {
				saveOfflineInfo(para);
			} else {
				alert("请求服务器出错");
			}
		}
	});
};

function saveOfflineInfo(para) {

	var log = {
		type: "副料打包",
		operatetime: kendo.toString(kendo.parseDate(new Date()), 'yyyy-MM-dd HH:mm:ss'),
		status: "待处理",
		info: dealWithContent(para),
		content: JSON.stringify(para)
	};


	var array = isArrayFn(JSON.parse(storage.get("offline"))) ? JSON.parse(storage.get("offline")) : new Array();
	array.push(log);
	storage.put("offline", JSON.stringify(array));
	alert("网络环境不佳,请稍候在网络好的的地方再重新上传");
	$("#IMSPackingInput_yield").val("");
}

function dealWithContent(para) {

	$.each(para.typerows,function (n,item) {


		switch (item.type){
			case "0":
				item.type = "回条";
				break;
			case "1":
				item.type = "粗纱头";
				break;
			case "2":
				item.type = "白花";
				break;
		}
	});
	var content = JSON.stringify(para);


	return content.replace(/[{"}]/g, "")
		.replace(/typerows/, "内容")
		.replace(/flowcoderows/, "内容")
		.replace(/unit/g, "单位")
		.replace(/yield/g, "产量")
		.replace(/shiftdate/, "时间")
		.replace(/username/g, "操作人")
		.replace(/type/g, "类别")
		.replace(/shiftdate/g, "时间")
		.replace(/flowcode/g, "工序号")
		.replace(/machinerows/g, "机台")
		.replace(/devcode/g, "机台号")
		.replace(/varieties/g, "品种")

}
//判断是不是数组
function isArrayFn(value) {
	if(typeof Array.isArray === "function") {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === "[object Array]";
	}
}

function viewInit() {
	$("#time").kendoDatePicker({
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

	var todayDate = kendo.toString(kendo.parseDate(new Date()), 'yyyy-MM-dd');
	$("#time").data("kendoDatePicker").value(todayDate);
}

function viewShow() {
	var dataSource = kendo.data.DataSource.create({
		data: [{}],
	});

	var listViewModel = new kendo.observable({
		packingInputDataSource: dataSource,
	});
	kendo.bind($("#packingInput_listview"), listViewModel);

	$("#datepicker").kendoDatePicker({
		animation: false,
		culture: "zh-CN",
		format: "yyyy-MM-dd"
	});

	var todayDate = kendo.toString(kendo.parseDate(new Date()), 'yyyy-MM-dd');
	$("#datepicker").data("kendoDatePicker").value(todayDate);

}

$("#packingInput_confirmButton").click(function() {
	postPackingInputData();
});

$("#packingInput_button_1").click(function() {
	type = "0";
	$("#IMSPackingInput_yield").val("");
	$("#packingInput_button_1").attr("style", "width: 31%;background-color: #A9293D;color: #FFFFFF;border-color: #A9293D;");
	$("#packingInput_button_2").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
	$("#packingInput_button_3").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
});

$("#packingInput_button_2").click(function() {
	type = "1";
	$("#IMSPackingInput_yield").val("");
	$("#packingInput_button_1").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
	$("#packingInput_button_2").attr("style", "width: 31%;background-color: #A9293D;color: #FFFFFF;border-color: #A9293D;");
	$("#packingInput_button_3").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
});

$("#packingInput_button_3").click(function() {
	type = "2";
	$("#IMSPackingInput_yield").val("");
	$("#packingInput_button_1").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
	$("#packingInput_button_2").attr("style", "width: 31%;background-color: #EEEEEE;color: #AAAAAA;border-color: #EEEEEE;");
	$("#packingInput_button_3").attr("style", "width: 31%;background-color: #A9293D;color: #FFFFFF;border-color: #A9293D;");
});