/**
 * Created by mac on 16/8/30.
 */

window.app = new kendo.mobile.Application(document.body, {
	platform: 'ios',
	skin: 'nova',
	layout: 'default',
	transition:'overlay'
});
function viewInit(){
	$("#username").text(storage.get("username"));
	$("#deptname").text(storage.get("deptname"));
	$("#rolename").text(storage.get("rolename"));
}
function viewShow() {

	$("#bindingMachine_leftNavButton").hide();

	

}

function viewBeforeHide() {
	$("#bindingMachine_leftNavButton").show();
	//$("#packingInput_rightNavButton_1").data("kendoMobileButton").badge(100);
}
var actionsheetAction = {
	action0:function(){ 	machine_input("0");},
	action1:function(){ 	machine_input("1");},
	action2:function(){ 	machine_input("2");},
}
function machine_input(type) {
	var urlString = "yieldinput.html?type="+type ;
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
			alert("收到自定义信息" + message);
			alert("收到自定义信息" + message);
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

	window.plugins.jPushPlugin.setTagsWithAlias([], "");

	setTimeout(function() {
		window.location.href = "../index.html";
	}, 2000);

});