/**
 * Created by Satoru on 16/9/20.
 */

function viewShow(e) {
	var navbar = $("#navbar").kendoMobileNavBar();
	warningDetailInitRequest(e.view.params.deviceCode);
}

function warningDetailInitRequest(devcode) {

	var params = {
		"devcode": devcode,
		"account": storage.get("account"),
		"srcid": storage.get("srcid"),
		"type": "1"
	};

	$.ajax({
		type: "post",
		url: IMSUrl + "devcodeDetail/",
		async: true,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify(params)
		},
		dataType: "json",
		success: function(data) {
			warningDetailBindView(data, devcode);
		},
		error: function(data, status, e) {
			alert("请求服务器出错");
		}
	});

}

function warningDetailBindView(data, devcode) {
	if(data.outstatus != 0) {
		alert(data.outputstr);
	} else if(data.outstatus == 0) {
		alert(JSON.stringify(data.outputstr));
		$("#warningDetail_devcode").text(devcode);
		$("#warningDetail_ProductionKM").text(data.outputstr.ProductionKM);
		$("#warningDetail_ArticleName").text(data.outputstr.ArticleName);
		$("#warningDetail_EfficProduction").text(data.outputstr.EfficProduction);
		var alarmrows = data.outputstr.alarmrows;
		$.each(alarmrows, function(n, value) {
			var messageid = value.messageid;
			switch(messageid) {
				case "0":
					{
						var txt = $("#warningDetail_deviceStatusMessage").text() + value.message + "<br>";
						$("#warningDetail_deviceStatusMessage").html(txt);
					}
					break;
				case "1":
					{
						//不处理
						var category = new Array();
						category.push({
							"otherMessage": value.alarmtime + " " + value.message
						});
						dataSource = kendo.data.DataSource.create({
							data: category,
						});

						var contentViewModel = kendo.observable({
							"dataSource": dataSource,

						});
						kendo.bind($("#warningDetailListView"), contentViewModel);
					}
					break;
				case "2":
					break;
				case "3":
					{
						var category = new Array();
						category.push({
							"otherMessage": value.message
						});
						dataSource = kendo.data.DataSource.create({
							data: category,
						});

						var contentViewModel = kendo.observable({
							"dataSource": dataSource,

						});
						kendo.bind($("#warningDetailListView"), contentViewModel);
					}
					break;
				default:
					{
						console.log("******error: warningDetailDefault");
					}
					break;
			}
		});
	}
}