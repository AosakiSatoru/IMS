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
           timeout: 1000,
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