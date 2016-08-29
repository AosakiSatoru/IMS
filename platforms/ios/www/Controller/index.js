function RequestPreHookData() {
    var userName = $("#loginUserName").val();
    var password = $("#loginPassword").val();
    var para = {
        "account":userName,
        "password":password,
        "channel":0
    };
    $.ajax({
           type: "post",
           url: "http://www.baidu.com/",
           async: false,
           data: {
           "method": "busi_login",
           "parameter": JSON.stringify(para)
           },
           dataType: "json",
           success: function(d) {
           alert(JSON.stringify(d));
           },
           error: function() {
           alert("请求失败!");
           }
           });
};

$(document).ready(function(){
                  $("#loginButton").click(function(){
                                          RequestPreHookData();
                                          });
                  });