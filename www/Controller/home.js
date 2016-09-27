/**
 * Created by mac on 16/8/30.
 */

window.app = new kendo.mobile.Application(document.body,
    {
        platform:'ios',
        skin:'nova',
		// layout:'xxx'

    });

function machine_input(type){
				app.navigate("yieldinput.html?type="+type);

				//window.location.href = "yieldinput.html?type="+type;

			}

			$("#bindingMachine").click(function() {
			//	window.location.href = "bindingMachine.html";
                app.navigate("bindingMachine.html");
			});
			$("#packingInput").click(function() {
				app.navigate("packingInput.html");
				//window.location.href = "";
			});
			$("#warning").click(function() {
				//window.location.href = "warningList.html";
				app.navigate("warningList.html");
			});
function back() {
	app.navigate("home.html");
}
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
			// 开启
			alert("开启");
		} else {
			// 关闭
			alert("关闭");
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
			$("#notificationResult").html(alertContent);
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
			$("#messageResult").html(message);
		} catch (exception) {
			console.log("JPushPlugin:onReceiveMessage-->" + exception);
		}
	};
	document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
	document.addEventListener("jpush.receiveMessage", onReceiveMessage, false);
}, false);




