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

			JPushPlugin.prototype.setTagsWithAlias(storage.get("roleids"), storage.get("srcid"));
		} catch(exception) {
			alert(exception+"出错");
		}
	}
	window.plugins.jPushPlugin.isPushStopped(function (result) {
		if (result == 0) {

		} else {
			JPushPlugin.prototype.setTagsWithAlias(storage.get("roleids"), storage.get("srcid"));
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

			//alert("i onReceiveNotification"+alertContent);
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
			alert("i onReceiveMessage"+message);
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
			alert("onOpenNotification");
			app.navigate("warningList.html");
		} catch (exception) {
			alert("JPushPlugin:onReceiveMessage-->" + exception);
		}
	};
	document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
	document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
	document.addEventListener("jpush.openNotification", onOpenNotification, false);
}, false);

$("#logout").click(function () {
	JPushPlugin.prototype.setTagsWithAlias(storage.get("roleids"), storage.get("srcid"));
	//this.location.href="index.html";
	window.location.href = "../index.html";
});



