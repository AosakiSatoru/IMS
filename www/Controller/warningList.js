function viewShow() {
	var navbar = $("#navbar").kendoMobileNavBar();
	webRequest();
}

function webRequest() {

	var params = {
		"account": storage.get("account"),
		"srcid": storage.get("srcid"),
		"messageid": "*"
	};

	$.ajax({
		type: "post",
		url: IMSUrl + "busi_alarm/",
		async: true,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify(params)
		},
		dataType: "json",
		success: function(data) {
			warningListBindView(data);
		},
		error: function(data, status, e) {
			alert("请求服务器出错");
		}
	});
}

function warningListBindView(data) {
	if(data.outstatus != 0) {
		alert(data.outputstr);
	} else if(data.outstatus == 0) {
//		alert(JSON.stringify(data.outputstr.Messagerows));
		var messageArray = data.outputstr.Messagerows;
		$.each(messageArray, function(n, value) {
			if(value.messagename == "设备告警")
				$("#warningListBadge_1").text(value.quantity);
		});
		$.each(messageArray, function(n, value) {
			if(value.messagename == "生产效率告警")
				$("#warningListBadge_2").text(value.quantity);
		});
		$.each(messageArray, function(n, value) {
			if(value.messagename == "质量告警")
				$("#warningListBadge_3").text(value.quantity);
		});
		$.each(messageArray, function(n, value) {
			if(value.messagename == "其他告警信息")
				$("#warningListBadge_4").text(value.quantity);
		});
	}
}