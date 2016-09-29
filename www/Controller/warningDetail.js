/**
 * Created by Satoru on 16/9/20.
 */

var workingMark = false;

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
						if(!workingMark) {
							workingMark = true;
							$("#warningDetail_deviceStatusMessage").html(value.message + "<br>");
						} else {
							var txt = $("#warningDetail_deviceStatusMessage").html() + value.message + "<br>";
							$("#warningDetail_deviceStatusMessage").html(txt);
						}
					}
					break;
				case "1":
					{
						//不处理
					}
					break;
				case "2":
					{
						switch(value.messagechild) {
							case "01":
								{
									if(!workingMark) {
										workingMark = true;
										$("#warningDetail_QualityMessage_1").html(value.message + "<br>");
										$("#warningDetail_QualityMessageTitle_1").text("组切割");
									} else {
										var txt = $("#warningDetail_QualityMessage_1").html() + value.message + "<br>";
										$("#warningDetail_QualityMessage_1").html(txt);
									}
								}
								break;
							default:
								{

								}
								break;
						}
					}
					break;
				case "3":
					{
						var category = new Array();
						category.push({
							"otherMessage": new Date(value.alarmtime).Format("yyyy-MM-dd hh:mm") + "&nbsp&nbsp&nbsp" + value.message
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
		workingMark = false;
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