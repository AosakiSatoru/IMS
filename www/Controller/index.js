 	
 	if(storage.get("login")=="yes"){
 		kendo.ui.progress($("#IMSLogin"), true);
	setTimeout(function() {
		kendo.ui.progress($("#IMSLogin"), false);
		window.location.href = "View/home.html";
	}, 1000);
 		
 	}else{
 		try {
			window.plugins.jPushPlugin.setTagsWithAlias([], "");
		} catch(exception) {
			
		}
 	}
 	
		
 	var app = new kendo.mobile.Application(document.body,{
        			platform:'ios',
        			skin:'nova'
    			});
 function showPassword(element){
 	
 	if(element.checked){
 		$("#loginPassword")[0].type = "text";
 	}else{
 		$("#loginPassword")[0].type = "password";
 	}
 }
function RequestPreHookData() {
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
    var url = IMSUrl+"busi_login/";
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
           	 kendo.ui.progress($("#IMSLogin"), false);
           if(data.outstatus == 201) {
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
           storage.put("login","yes");
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



    function showAccountClearBtn(){
    		if(document.getElementById('loginUserName').value.length > 0){
    		document.getElementById('accountClearBtn').style.display = 'block';
    		}else{
    		document.getElementById('accountClearBtn').style.display = 'none';
    		}
    }
	function showPasswordClearBtn(){
    		if(document.getElementById('loginPassword').value.length > 0){
    		document.getElementById('passwordClearBtn').style.display = 'block';
    		}else{
    		document.getElementById('passwordClearBtn').style.display = 'none';
    		}
    }
    function clearAccountText(){
    		document.getElementById('loginUserName').value = '';
    		document.getElementById('accountClearBtn').style.display = 'none';
    }
    function clearPasswordText(){
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
