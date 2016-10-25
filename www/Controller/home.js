/**
 * Created by mac on 16/8/30.
 */

window.app = new kendo.mobile.Application(document.body, {
	platform: 'ios',
	skin: 'nova',
	layout: 'default',
	transition: 'overlay'
});

$("#datepicker").kendoDatePicker({
	animation: false,
	culture: "zh-CN",
	format: "yyyy-MM-dd"
});
var todayDate = kendo.toString(kendo.parseDate(new Date()), 'yyyy-MM-dd');
$("#datepicker").data("kendoDatePicker").value(todayDate);
var beginDate; // 两次点击退出按钮开始时间  
var isToast = false; // 是否弹出弹框  

var exitFunction = function() {
	var endDate = new Date().getTime(); // 两次点击退出按钮结束时间  
	// 提示过Toast并且两次点击时间小于2S  
	if(isToast && endDate - beginDate < 2000) {
		beginDate = endDate;
		isToast = false;
		navigator.app.exitApp();
	} else Toast('再次点击退出程序', 2000);
};

function Toast(msg, duration) {
	isToast = true;
	beginDate = new Date().getTime();
	duration = isNaN(duration) ? 3000 : duration; // duration是不是一个数字      
	var m = document.createElement('div');
	m.innerHTML = msg;
	m.style.cssText = "width:60%; min-width:150px; background:#000; opacity:0.5; height:40px; color:#fff; line-height:40px; text-align:center; border-radius:5px; position:fixed; top:80%; left:20%; z-index:999999; font-weight:bold;";
	document.body.appendChild(m);
	setTimeout(function() {
		var d = 0.5;
		m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
		m.style.opacity = '0';
		setTimeout(function() {
			document.body.removeChild(m)
		}, d * 1000);
	}, duration);
}

function viewInit() {
	$("#username").text(storage.get("username") != "undefined" ? storage.get("username") : " ");
	$("#deptname").text(storage.get("deptname") != "undefined" ? storage.get("deptname") : " ");
	$("#rolename").text(storage.get("rolename") != "undefined" ? storage.get("rolename") : " ");
}

function viewBeforeShow() {
	$("#left_drawerButton").show();
	$("#bindingMachine_leftNavButton").hide();
}

function viewAfterShow() {
	$("#left_drawerButton").show();
	$("#bindingMachine_leftNavButton").hide();
	document.addEventListener("backbutton", exitFunction, false);
	beginDate = new Date().getTime();

	home_dealloc();
}

function home_dealloc() {
	//IMSBindingMachine dealloc
	if($("#IMSBindingMachine").data("kendoMobileView"))
		$("#IMSBindingMachine").data("kendoMobileView").destroy();
	if($("#IMSBindingMachine"))
		$("#IMSBindingMachine").remove();

	//IMSYieldinput dealloc
	if($("#IMSYieldinput").data("kendoMobileView"))
		$("#IMSYieldinput").data("kendoMobileView").destroy();
	if($("#IMSYieldinput"))
		$("#IMSYieldinput").remove();
		
	//IMSPackingInput dealloc
	if($("#IMSPackingInput").data("kendoMobileView"))
		$("#IMSPackingInput").data("kendoMobileView").destroy();
	if($("#IMSPackingInput"))
		$("#IMSPackingInput").remove();

	//IMSQueryYieldInput dealloc
	if($("#queryYieldInput_procedure-list").data("kendoPopup"))
		$("#queryYieldInput_procedure-list").data("kendoPopup").destroy();
	if($("#queryYieldInput_machine-list").data("kendoPopup"))
		$("#queryYieldInput_machine-list").data("kendoPopup").destroy();
	if($("#duty-list").data("kendoPopup"))
		$("#duty-list").data("kendoPopup").destroy();
	if($("#IMSQueryYieldInput").data("kendoMobileView"))
		$("#IMSQueryYieldInput").data("kendoMobileView").destroy();
	if($("#IMSQueryYieldInput"))
		$("#IMSQueryYieldInput").remove();

	//IMSQueryPackingInput dealloc
	if($("#queryPackingInput_type-list").data("kendoPopup"))
		$("#queryPackingInput_type-list").data("kendoPopup").destroy();
	if($("#IMSQueryPackingInput").data("kendoMobileView"))
		$("#IMSQueryPackingInput").data("kendoMobileView").destroy();
	if($("#IMSQueryPackingInput"))
		$("#IMSQueryPackingInput").remove();
}

function viewBeforeHide() {
	$("#left_drawerButton").hide();
	$("#bindingMachine_leftNavButton").show();
	//$("#packingInput_rightNavButton_1").data("kendoMobileButton").badge(100);
	document.removeEventListener("backbutton", exitFunction);
}
var actionsheetAction = {
	action0: function() {
		app.navigate("query_yield_input.html");
	},
	action1: function() {
		app.navigate("query_packing_input.html");
	}
}

function machine_input(type) {
	var urlString = "yield_input.html?type=" + type + "&selectdate=" + $("#datepicker").val();
	app.navigate(urlString);
}
$("#bindingMachine").click(function() {
	$("#homeDrawer").data("kendoMobileDrawer").hide();
	setTimeout(function() {
		app.navigate("binding_machine.html");
	}, 200);

});
$("#packingInput").click(function() {
	app.navigate("packing_input.html");
});
$("#warning").click(function() {
	app.navigate("warning_list.html");
});
$("#queryYieldInput").click(function() {
	app.navigate("query_yield_input.html");
});
$("#queryPackingInput").click(function() {
	app.navigate("query_packing_input.html");
});

document.addEventListener("deviceready", function() {

	window.plugins.jPushPlugin.init();

	window.plugins.jPushPlugin.isPushStopped(function(result) {
		if(result == 0) {
			//开启了
			if(storage.get("alias") != storage.get("srcid")) {

				window.plugins.jPushPlugin.setTagsWithAlias([storage.get("roleids")], storage.get("srcid"));
			}
			console.log("getRegistrationID");

		} else {

		}
	})

	var onReceiveMessage = function(event) {
		try {
			var message;
			if(device.platform == "Android") {
				message = event.message;
			} else {
				message = event.content;
			}
			//alert("i onReceiveMessage"+JSON.stringify(event));
			//alert("收到自定义信息" + message);
			$(".km-badge").text(JSON.parse(message)["告警汇总"]);
		} catch(exception) {
			alert("JPushPlugin:onReceiveMessage-->" + exception);
		}
	};

	var onOpenNotification = function(event) {
		try {
			if(device.platform == "iOS") {
				window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
			}
			app.navigate("warning_list.html");
		} catch(exception) {
			alert("出错 JPushPlugin:onReceiveMessage-->" + exception);
		}
	};
	var onTagsWithAlias = function(event) {
		try {
			storage.put("alias", event.alias);
		} catch(exception) {
			console.log(exception);

		}
	}
	document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
	document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
	document.addEventListener("jpush.openNotification", onOpenNotification, false);

}, false);

$("#logout").click(function() {
	try {
		window.plugins.jPushPlugin.setTagsWithAlias([], "");
	} catch(exception) {

	}
	$("#homeDrawer").data("kendoMobileDrawer").hide();
	kendo.ui.progress($("#IMSHome"), true);
	setTimeout(function() {
		storage.put("login", "no");
		kendo.ui.progress($("#IMSHome"), false);
		window.location.href = "../index.html";
	}, 1000);

});

//弹出视图事件
$("#chooseJia").click(function() {
	machine_input("0");
	$("#yieldInputModal").data("kendoMobileModalView").close();

});
$("#chooseYi").click(function() {
	machine_input("1");
	$("#yieldInputModal").data("kendoMobileModalView").close();

});
$("#chooseBing").click(function() {
	machine_input("2");
	$("#yieldInputModal").data("kendoMobileModalView").close();

});
$("#cancelModalView").click(function() {
	$("#yieldInputModal").data("kendoMobileModalView").close();
});