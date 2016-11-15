/**
 * Created by mac on 16/9/7.
 */

var flowArray;
var isAll = false;
var messageid_global;
var data_global;

//params mark - Initalize
function viewInit(e) {
	//	app.view().header.find(".km-navbar").data("kendoMobileNavBar").title("test");
	//	app.view().header.find(".km-navbar").data("kendoMobileNavBar").refresh();
	messageid_global = e.view.params.messageid;

	$("#warningInfo_allButton").attr("style", "width: 40%;background-color: #FFFFFF;color: #A9293D;border-color: #A9293D;border-radius: 2px;");
	isAll = false;

	warningInfoFetchDataRequest(true, messageid_global);

	var dataSource = kendo.data.DataSource.create({
		data: [{}],
	});

	var listViewModel = new kendo.observable({
		warningInfoCommonDataSource: dataSource,
	});
	kendo.bind($("#warningInfoCommonlistview"), listViewModel);
}

function viewShow(e) {

}

function viewAfterShow() {
	warningInfo_dealloc();
}

function warningInfo_dealloc() {
	//IMSWarningDetail dealloc
	if($("#IMSWarningDetail").data("kendoMobileView"))
		$("#IMSWarningDetail").data("kendoMobileView").destroy();
	if($("#IMSWarningDetail"))
		$("#IMSWarningDetail").remove();
}

function warningInfo_listViewClick(e) {
	var button = $(e.item.find("#warningInfoDetailButton")[0]);
	app.navigate("#warning_detail.html?deviceCode=" + button.attr("deviceCode"));
}
//params mark - Interface
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
	kendo.ui.progress($("#IMSWarningInfo"), true);
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
			kendo.ui.progress($("#IMSWarningInfo"), false);
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSWarningInfo"), false);
			alert("请求服务器出错");
		}
	});

}

//params mark - Action
function warningInfoBindView(data, messageid, filtercode) {
	if(data.outstatus != 0) {
		alert(data.outputstr);
	} else if(data.outstatus == 0) {
		//				alert(JSON.stringify(data.outputstr.Messagerows));
		var category = new Array();
		flowArray = data.outputstr.Messagerows;
		$.each(flowArray, function(n, flowValue) {

			if(filtercode == 'init' || filtercode == 'ALL' || filtercode == flowValue.flowcode) {
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
		var dataSource = kendo.data.DataSource.create({
			data: category,
		});

		var contentViewModel = kendo.observable({
			"dataSource": dataSource,
			detailClicked: function(e) {
				app.navigate("#warning_detail.html?deviceCode=" + e.target.attr("deviceCode"));
			}
		});
		if(filtercode == 'init') kendo.bind($("#warningInfoListView"), contentViewModel);
		else $("#warningInfoListView").data("kendoMobileListView").setDataSource(contentViewModel.dataSource);

	}
}

$("#warningInfo_allButton").click(function() {
	if(isAll) {
		$("#warningInfo_allButton").attr("style", "width: 40%;background-color: #FFFFFF;color: #A9293D;border-color: #A9293D;border-radius: 2px;");
		isAll = false;
	} else {
		$("#warningInfo_allButton").attr("style", "width: 40%;background-color: #A9293D;color: #FFFFFF;border-color: #A9293D;border-radius: 2px;");
		isAll = true;
	}
	warningInfoFetchDataRequest(!isAll, messageid_global);
	$(".selector").val("");
});

function warningInfo_filter(flowcode) {
	warningInfoBindView(data_global, messageid_global, flowcode);
	$("#warningInfo_actionsheet").data("kendoMobileActionSheet").close();
}

function warningInfo_displayStatus(status) {
	if(status == "ALL") isAll = true;
	else isAll = false;
	warningInfoFetchDataRequest(!isAll, messageid_global);
	$(".selector").val("");
}