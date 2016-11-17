"use strict";
var beginDate; // 两次点击退出按钮开始时间
var isToast = false; // 是否弹出弹框  
var updateUrl;



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

document.addEventListener("deviceready", function() {
	try {
		var platform = (device.platform == "Android") ? "ANDROID" : "IOS";
		$.ajax({
			type: "post",
			url: IMSUrl + "getAppVersion/",
			timeout: 4000,
			async: true,
			dataType: "json",
			data: {
				"parameter": JSON.stringify({
					"platform": platform
				})
			},

			success: function(data) {
				console.log(data);
				if(data.outputstr.version > AppVersion.version) {
					$("#updateModal").data("kendoMobileModalView").open();
					updateUrl = data.outputstr.url;
					console.log("Server Version:" + data.outputstr.version + " App Version:" + AppVersion.version + " Need Update");
				} else {
					console.log("Server Version:" + data.outputstr.version + " App Version:" + AppVersion.version + " No Update");
				}
			},
			error: function(data, status, e) {
				console.log("error:00001 get Version Fail!");
			}
		});
	} catch(exception) {

	}
	//显示版本号
	try {
		$("#version").text("V" + AppVersion.version);
	} catch(e) {

	}
	
	try {
		window.plugins.jPushPlugin.setTagsWithAlias([], "");
	} catch(exception) {

	}


	$("#loginUserName").kendoComboBox({
		clearButton: true,
		dataSource: historyAccounts(),
		dataTextField: "name",
		dataValueField: "name"

	});

});
var app = new kendo.mobile.Application(document.body, {
	platform: 'ios',
	skin: 'nova'
});
function historyAccounts() {
	return JSON.parse(storage.get("accounts"))? JSON.parse(storage.get("accounts")): new Array();
}
function addAccountIfNeeded(name) {

	var history = historyAccounts();
	var accounts = history.map(function (item) {

		 return item.name;
	});

	if($.inArray( name,accounts) == -1){
		history.push({"name":name});
		storage.put("accounts",JSON.stringify(history));
	}


}
function removeAllAccounts() {
	storage.put("accounts",JSON.stringify([]));
	$("#loginUserName").data("kendoComboBox").close();
	$("#loginUserName").data("kendoComboBox").setDataSource(historyAccounts());
}
function showPassword(element) {

	if(element.checked) {
		$("#loginPassword")[0].type = "text";
	} else {
		$("#loginPassword")[0].type = "password";
	}
}

function viewBeforeShow() {
	beginDate = new Date().getTime();
	document.addEventListener("backbutton", exitFunction, false);
	//document.addEventListener("jpush.openNotification", onOpenNotification, false);
	try {
		window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
	} catch (e){

	}
}

function viewBeforeHide() {
	document.removeEventListener("backbutton", exitFunction);
//	document.removeEventListener("jpush.openNotification", onOpenNotification, false);
}

function RequestPreHookData() {
	var userName = $("#loginUserName").data("kendoComboBox").text().trim();
	var password = $("#loginPassword").val();

	var para = {
		"account": userName,
		"password": password,
		"channel": 0
	};

	try{
		if(device.platform == "Android"){
			para.channel = 2;
		}else{
			para.channel = 1;
		}
	}catch (e){

	};

	if($("#loginUserName").data("kendoComboBox").text().length == 0) {
		alert("请输入账号");
		return;
	}

	if(password.length == 0) {
		alert("请输入密码");
		return;
	}
	kendo.ui.progress($("#IMSLogin"), true);
	var url = IMSUrl + "busi_login/";
	$.ajax({
		type: "post",
		url: url,
		timeout: 30000,
		async: true,
		dataType: "json",
		data: {
			"parameter": JSON.stringify(para)
		},
		success: function(data) {

			if(data.outstatus == 201) {
				kendo.ui.progress($("#IMSLogin"), false);
				alert("账号或密码出错");
			} else if(data.outstatus == 0) {
				addAccountIfNeeded($("#loginUserName").data("kendoComboBox").text());
				storage.put("account", data.outputstr.account);
				storage.put("deptid", data.outputstr.deptid);
				storage.put("deptname", data.outputstr.deptname);
				storage.put("roleids", data.outputstr.roleids);
				storage.put("rolename", data.outputstr.rolename);
				storage.put("srcid", data.outputstr.srcid);
				storage.put("username", data.outputstr.username);
				storage.put("flowcode", data.outputstr.flowcode);
				storage.put("flight", data.outputstr.flight);
				storage.put("duty", data.outputstr.duty);
				storage.put("machinerows", JSON.stringify(data.outputstr.machinerows));
				storage.put("login", "yes");
				window.location.href = "View/home.html";
			}
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSLogin"), false);
			alert("请求服务器出错");
		}
	});
};

$(document).ready(function() {
	document.getElementById('accountClearBtn').style.display = 'none';
	document.getElementById('passwordClearBtn').style.display = 'none';
	$("#loginButton").click(function() {
		RequestPreHookData();
	});
});

function showAccountClearBtn() {
	if($("#loginUserName").data("kendoComboBox").text().length > 0) {
		document.getElementById('accountClearBtn').style.display = 'block';
	} else {
		document.getElementById('accountClearBtn').style.display = 'none';
	}
}

function showPasswordClearBtn() {
	if(document.getElementById('loginPassword').value.length > 0) {
		document.getElementById('passwordClearBtn').style.display = 'block';
	} else {
		document.getElementById('passwordClearBtn').style.display = 'none';
	}
}

function clearAccountText() {
	document.getElementById('loginUserName').value = '';
	document.getElementById('accountClearBtn').style.display = 'none';
}

function clearPasswordText() {
	document.getElementById('loginPassword').value = '';
	document.getElementById('passwordClearBtn').style.display = 'none';
}
$('input#loginUserName').bind('keypress', function(event) {
	if(event.keyCode == "13") {
		$('input#loginPassword').focus();
	}
});
$('input#loginPassword').bind('keypress', function(event) {
	if(event.keyCode == "13") {
		RequestPreHookData();
	}
});

$("#updateButton").click(function (){
	window.open(updateUrl, '_system');
//	$("#updateModal").data("kendoMobileModalView").close();
});
