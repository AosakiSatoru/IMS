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

document.addEventListener("deviceready", function() {
	if(storage.get("login") == "yes") {
		kendo.ui.progress($("#IMSLogin"), true);
		setTimeout(function() {
			window.location.href = "View/home.html";
		}, 1000);

	} else {
		try {
			window.plugins.jPushPlugin.setTagsWithAlias([], "");
		} catch(exception) {

		}
	}
	//显示版本号
	try {
		$("#version").text("V" + AppVersion.version);
	} catch(e) {

	}

});
var app = new kendo.mobile.Application(document.body, {
	platform: 'ios',
	skin: 'nova'
});

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
}

function viewBeforeHide() {
	document.removeEventListener("backbutton", exitFunction);
}

function RequestPreHookData() {
    window.open('http://www.baidu.com', '_system');
    return;
	var userName = $("#loginUserName").val().trim();
	var password = $("#loginPassword").val();

	var para = {
		"account": userName,
		"password": password,
		"channel": 1
	};

	if(userName.length == 0) {
		alert("请输入名字");
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
		timeout: 10000,
		async: true,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify(para)
		},
		dataType: "json",
		success: function(data) {

			if(data.outstatus == 201) {
				kendo.ui.progress($("#IMSLogin"), false);
				alert("账号或密码出错");
			} else if(data.outstatus == 0) {
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
				storage.put("machinerows", data.outputstr.machinerows);
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
	if(document.getElementById('loginUserName').value.length > 0) {
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
