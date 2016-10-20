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

function viewAfterShow() {
	$("#bindingMachine_leftNavButton").hide();
	document.addEventListener("backbutton", exitFunction, false);
	beginDate = new Date().getTime()
}

function viewBeforeHide() {
	$("#bindingMachine_leftNavButton").show();
	//$("#packingInput_rightNavButton_1").data("kendoMobileButton").badge(100);
	document.removeEventListener("backbutton", exitFunction);
}
var actionsheetAction = {
	action0: function() {
	app.navigate("queryYieldInput.html");
	},
	action1: function() {
	app.navigate("queryPackingInput.html");
	}
}

function machine_input(type) {
	var urlString = "yieldInput.html?type=" + type + "&selectdate=" + $("#datepicker").val();
	app.navigate(urlString);
}
$("#bindingMachine").click(function() {
	$("#homeDrawer").data("kendoMobileDrawer").hide();
	setTimeout(function() {
		app.navigate("bindingMachine.html");
	}, 200);

});
$("#packingInput").click(function() {
	app.navigate("packingInput.html");

});
$("#warning").click(function() {

	app.navigate("warningList.html");
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
			var message;
			if(device.platform == "Android") {
				message = event.message;
			} else {
				message = event.content;
			}
			//alert("onOpenNotification"+JSON.stringify(event));
			app.navigate("warningList.html");
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
		 storage.put("login","no");
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