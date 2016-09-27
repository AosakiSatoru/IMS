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
			alert("JPushPlugin:registrationID is " + data);
		} catch(exception) {
			alert(exception);
		}
	}
	window.plugins.jPushPlugin.isPushStopped(function (result) {
		if (result == 0) {

		} else {

		}
	})

	var onReceiveNotification = function(event) {
		try {
			var alertContent;
			if (device.platform == "Android") {ƒ
				alertContent = event.alert;
			} else {
				alertContent = event.aps.alert;
			}

			alert("i onReceiveNotification"+alertContent);
		} catch (exception) {
			console.log(exception)
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
			console.log("JPushPlugin:onReceiveMessage-->" + exception);
		}
	};

	var onOpenNotification = function(event){
		alert("onOpenNotification");
		app.navigate("warningList.html");
	};
	document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
	document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
	document.addEventListener("jpush.openNotification", onOpenNotification, false);
}, false);




