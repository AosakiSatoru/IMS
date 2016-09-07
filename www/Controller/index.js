function RequestPreHookData() {
    
    var userName = $("#loginUserName").val();
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
           window.location.href = "View/home.html";
           }
           },
           error: function(data, status, e) {
           
           alert("请求服务器出错");
           }
           });
};

$(document).ready(function() {
                  $("#loginButton").click(function() {
                                          RequestPreHookData();
                                          });
                  });