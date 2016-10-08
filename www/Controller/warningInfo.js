/**
 * Created by mac on 16/9/7.
 */

var flowArray;
var isAll = false;
var messageid_global;
var data_global;

function viewShow(e) {
	//	app.view().header.find(".km-navbar").data("kendoMobileNavBar").title("test");
	//	app.view().header.find(".km-navbar").data("kendoMobileNavBar").refresh();
	messageid_global = e.view.params.messageid;
	$("#warningInfo_allButton").click(function() {
		if(isAll) {
			$("#warningInfo_allButton").attr("style", "width: 40%;background-color: #FFFFFF;color: #A9293D;border-color: #A9293D;border-radius: 2px;");
			isAll = false;
		} else {
			$("#warningInfo_allButton").attr("style", "width: 40%;background-color: #A9293D;color: #FFFFFF;border-color: #A9293D;border-radius: 2px;");
			isAll = true;
		}
		warningInfoFetchDataRequest(!isAll, messageid_global);
	});

	warningInfoFetchDataRequest(true, messageid_global);
}

// BOOL onlyShowBindingMachine -- "type":"define" 只显示绑定机台
//messsage id 消息类型
function warningInfoFetchDataRequest(onlyShowBindingMachine, messageid) {
	var params;
	if(onlyShowBindingMachine) {
		params = {
			"messageid": messageid,
			"account": storage.get("account"),
			"srcid": storage.get("srcid"),
			"type": "define"
		};
	} else {
		params = {
			"messageid": messageid,
			"account": storage.get("account"),
			"srcid": storage.get("srcid"),
		};
	}

	$.ajax({
		type: "post",
		url: IMSUrl + "busi_alarm/",
		async: false,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify(params)
		},
		dataType: "json",
		success: function(data) {
			data_global = data;
			warningInfoBindView(data, messageid, 'init');
		},
		error: function(data, status, e) {
			alert("请求服务器出错");
		}
	});

}

function warningInfoBindView(data, messageid, filtercode) {
	if(data.outstatus != 0) {
		alert(data.outputstr);
	} else if(data.outstatus == 0) {
//		alert(JSON.stringify(data.outputstr.Messagerows));
		var category = new Array();
		flowArray = data.outputstr.Messagerows;
		$.each(flowArray, function(n, flowValue) {

			if(filtercode == 'init' || filtercode == '0' || filtercode == flowValue.flowcode) {
				var deviceStatus;
				if(messageid == 0)
					deviceStatus = "设备告警";
				else if(messageid == 1)
					deviceStatus = "生产效率告警";
				else if(messageid == 2)
					deviceStatus = "质量告警";
				else if(messageid == 3)
					deviceStatus = "其他告警信息";

				var deviceArray = flowValue.devices;
				$.each(deviceArray, function(n, deviceValue) {
					var messageArray = deviceValue.alarms;
					var message = "";
					$.each(messageArray, function(n, messageValue) {
						message = message + messageValue.message + "<br>";
					});
					category.push({
						"deviceStatus": deviceStatus,
						"deviceName": deviceValue.devcodename,
						"deviceCode": deviceValue.devcode,
						"message": message
					});
				});
			}

		});
		dataSource = kendo.data.DataSource.create({
			data: category,
		});

		var contentViewModel = kendo.observable({
			"dataSource": dataSource,
			detailClicked: function(e) {
				app.navigate("#warningDetail.html?deviceCode=" + e.target.attr("deviceCode"));
			}
		});
		if(filtercode == 'init')kendo.bind($("#warningInfoListView"), contentViewModel);
		else $("#warningInfoListView").data("kendoMobileListView").setDataSource(contentViewModel.dataSource);
		
		
	}
}

function warningInfo_filter(flowcode) {
	warningInfoBindView(data_global, messageid_global, flowcode);
	$("#warningInfo_actionsheet").data("kendoMobileActionSheet").close();
}