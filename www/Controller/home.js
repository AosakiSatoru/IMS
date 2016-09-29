/**
 * Created by mac on 16/8/30.
 */

window.app = new kendo.mobile.Application(document.body,
    {
        platform:'ios',
        skin:'nova',
    });


function machine_input(type){
				app.navigate("yieldinput.html?type="+type);
			}

			$("#bindingMachine").click(function() {

                app.navigate("bindingMachine.html");
			});
			$("#packingInput").click(function() {
				app.navigate("packingInput.html");

			});
			$("#warning").click(function() {

				app.navigate("warningList.html");
			});

document.addEventListener("deviceready", function() {

	window.plugins.jPushPlugin.init();

	window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
	var onGetRegistradionID = function(data) {
		try {
			alert("成功注册id,要设置标签了 "+JSON.stringify(data));
			//window.plugins.jPushPlugin.setTagsWithAlias([storage.get("roleids")], storage.get("srcid"));
			//JPushPlugin.prototype.setTagsWithAlias(["abc"], "888");
			console.log("getRegistrationID");
		} catch(exception) {
			alert(exception+"出错");
		}
	}
	window.plugins.jPushPlugin.isPushStopped(function (result) {
		if (result == 0) {
			//开启了
			window.plugins.jPushPlugin.setTagsWithAlias(["2"], "XJE0000004");
			if(storage.get("alias").length==0||typeof(storage.get("alias")) == "undefined"){
			//	window.plugins.jPushPlugin.setTagsWithAlias([storage.get("roleids")], storage.get("srcid"));
			}
			console.log("getRegistrationID");

		} else {

		}
	})

	var onReceiveNotification = function(event) {
		try {
			var alertContent;
			if (device.platform == "Android") {
				alertContent = event.alert;
			} else {
				alertContent = event.aps.alert;
			}
			navigator.vibrate(2000);
			navigator.notification.beep(1);
			//console.log(JSON.stringify("onReceiveNotification");
			alert("i onReceiveNotification"+JSON.stringify(event));
		} catch (exception) {
			console.log(exception);
			alert("i onReceiveNotification error!");
		}
	};

	var onReceiveMessage = function(event) {
		try {
			var message;
			if (device.platform == "Android") {
				message = event.message;
			} else {
				message = event.content;
			}
			alert("i onReceiveMessage"+JSON.stringify(event));
		} catch (exception) {
			alert("JPushPlugin:onReceiveMessage-->" + exception);
		}
	};

	var onOpenNotification = function(event){

		try {
			var message;
			if (device.platform == "Android") {
				message = event.message;
			} else {
				message = event.content;
			}
			alert("onOpenNotification"+JSON.stringify(event));
			app.navigate("warningList.html");
		} catch (exception) {
			alert("JPushPlugin:onReceiveMessage-->" + exception);
		}
	};
	var onTagsWithAlias = function(event) {
		try {
			console.log("onTagsWithAlias");
			var result = "result code:"+event.resultCode + " ";
			result += "tags:" + event.tags + " ";
			result += "alias:" + event.alias + " ";
			storage.put("tag",tag[0]);
			storage.put("alias",event.alias);
			alert("tags and alias "+result);
		} catch(exception) {
			console.log(exception);
			alert("设置标签出错!"+JSON.stringify(exception));
		}
	}
	document.addEventListener("jpush.setTagsWithAlias", onTagsWithAlias, false);
	document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
	document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
	document.addEventListener("jpush.openNotification", onOpenNotification, false);

}, false);

$("#logout").click(function () {

	window.plugins.jPushPlugin.setTagsWithAlias([],"");

	setTimeout(function(){
		window.location.href = "../index.html";
	},2000);

});



