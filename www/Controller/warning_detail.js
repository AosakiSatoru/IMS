/**
 * Created by Satoru on 16/9/20.
 */

var workingMark = false;

function viewShow(e) {
	var navbar = $("#navbar").kendoMobileNavBar();
	warningDetailInitRequest(e.view.params.deviceCode);
	$(document).bind("kendo:skinChange", createChart);
}

function warningDetailInitRequest(devcode) {

	var params = {
		"devcode": devcode,
		"account": storage.get("account"),
		"srcid": storage.get("srcid"),
		"type": "1"
	};
	kendo.ui.progress($("#IMSWarningDetail"), true);
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
			kendo.ui.progress($("#IMSWarningDetail"), false);
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSWarningDetail"), false);
			alert("请求服务器出错");
		}
	});

}

function warningDetailBindView(data, devcode) {
	if(data.outstatus != 0) {
		GLOBAL_ErrorInfo(data);
	} else if(data.outstatus == 0) {
		$("#warningDetail_devcode").text(devcode);
		var ProductionKM = data.outputstr.ProductionKM;
		var ArticleName = data.outputstr.ArticleName;
		var EfficProduction = data.outputstr.EfficProduction;
		if(!data.outputstr.ProductionKM) ProductionKM = " ";
		if(!data.outputstr.ArticleName) ArticleName = " ";
		if(!data.outputstr.EfficProduction) EfficProduction = 0.00;

		if(EfficProduction > 20 || EfficProduction < 10) //阈值
			createChart(EfficProduction, "#A9293D");
		else
			createChart(EfficProduction, "#9DE219");

		$("#warningDetail_ProductionKM").text(ProductionKM);
		$("#warningDetail_ArticleName").text(ArticleName);
		$("#warningDetail_EfficProduction").text(EfficProduction);
		var alarmrows = data.outputstr.alarmrows;
		var category = new Array();
		var scrollViewCategory = new Array();
		var message_zqg = "";
		var message_dw = "";
		var message_scz = "";
		var message_a = "";
		var message_cv = "";
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
							case "01": //%A
								{
									if(!workingMark) {
										workingMark = true;
										message_a = value.message + "<br>";
									} else {
										message_a = message_a + value.message + "<br>";
									}
								}
								break;
							case "02": //CV%
								{
									if(!workingMark) {
										workingMark = true;
										message_cv = value.message + "<br>";
									} else {
										message_cv = message_cv + value.message + "<br>";
									}
								}
								break;
							case "03": //组切割:生产效率
								{
									if(!workingMark) {
										workingMark = true;
										message_zqg = value.message + "<br>";
									} else {
										message_zqg = message_zqg + value.message + "<br>";
									}
								}
								break;
							case "04": //组切割:纱疵报警
								{
									if(!workingMark) {
										workingMark = true;
										message_zqg = value.message + "<br>";
									} else {
										message_zqg = message_zqg + value.message + "<br>";
									}
								}
								break;
							case "05": //组切割:异纤报警
								{
									if(!workingMark) {
										workingMark = true;
										message_zqg = value.message + "<br>";
									} else {
										message_zqg = message_zqg + value.message + "<br>";
									}
								}
								break;
							case "06": //锭位:纱线接头
								{
									if(!workingMark) {
										workingMark = true;
										message_dw = value.message + "<br>";
									} else {
										message_dw = message_dw + value.message + "<br>";
									}
								}
								break;
							case "07": //锭位:深色异纤
								{
									if(!workingMark) {
										workingMark = true;
										message_dw = value.message + "<br>";
									} else {
										message_dw = message_dw + value.message + "<br>";
									}
								}
								break;
							case "08": //生产组:纱疵报警
								{
									if(!workingMark) {
										workingMark = true;
										message_scz = value.message + "<br>";
									} else {
										message_scz = message_scz + value.message + "<br>";
									}
								}
								break;
							case "09": //生产组:异纤报警
								{
									if(!workingMark) {
										workingMark = true;
										message_scz = value.message + "<br>";
									} else {
										message_scz = message_scz + value.message + "<br>";
									}
								}
								break;
							default:
								{
									console.log("******error: warningDetail-undefined messageChild");
								}
								break;
						}

					}
					break;
				case "3":
					{
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
						console.log("******error: warningDetail-undefined messageid");
					}
					break;
			}
		});
		workingMark = false;
		if(message_zqg != "" || message_dw != "" || message_scz != "") {
			scrollViewCategory.push({
				"Title_1": "组切割",
				"Message_1": message_zqg,
				"Title_2": "锭位",
				"Message_2": message_dw,
				"Title_3": "生产组",
				"Message_3": message_scz
			});
		}
		if(message_a != "" || message_cv != "") {
			scrollViewCategory.push({
				"Title_1": "%A",
				"Message_1": message_a,
				"Title_2": "CV%",
				"Message_2": message_cv,
				"Title_3": "",
				"Message_3": ""
			});
		}
		if(message_zqg == "" && message_dw == "" && message_scz == "" && message_a == "" && message_cv == "") {
			scrollViewCategory.push({
				"Title_1": "",
				"Message_1": "",
				"Title_2": "",
				"Message_2": "",
				"Title_3": "",
				"Message_3": ""
			});
		}

		var scrollViewDataSource = kendo.data.DataSource.create({
			data: scrollViewCategory,
		});

		var contentScrollViewModel = kendo.observable({
			"scrollViewDataSource": scrollViewDataSource,
		});
		kendo.bind($("#warningDetailScrollView"), contentScrollViewModel);
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

function createChart(productionEfficiency, color) {
	$("#chart").kendoChart({
		title: {
			//			position: "top",
			//			text: "生产效率"
		},
		legend: {
			visible: false
		},
		chartArea: {
			background: ""
		},
		seriesDefaults: {
			type: "donut",
			startAngle: 90
		},
		series: [{
			name: "",
			data: [{}]
		}, {
			name: "生产效率",
			data: [{
				category: "生产中",
				value: productionEfficiency,
				color: color
			}, {
				category: "未生产",
				value: 100.00 - productionEfficiency,
				color: "#EEEEEE"
			}],
			labels: {
				visible: false,
				background: "transparent",
				//				position: "outsideEnd",
				template: /*"#= category #:*/ "#= value#%"
			}
		}],
		tooltip: {
			visible: true,
			template: /*"#= series.name #:*/ "#= value #%"
		}
	});
}