
function viewShow(){
   	var navbar = $("#navbar").kendoMobileNavBar();
	webRequest();
}

function webRequest(){
	
	var params = {
				"account": storage.get("account"),
				"srcid": storage.get("srcid"),
				"messageid" : "*"
			};
			
	
	$.ajax({
           type: "post",
           url: IMSUrl+"busi_alarm/",
           async: true,
           dataType: "jsonp",
           data: {
           "parameter": JSON.stringify(params)
           },
           dataType: "json",
           success: function(data) {
            alert(JSON.stringify(data.outputstr.Messagerows));
           },
           error: function(data, status, e) {
           alert("请求服务器出错");
           }
           });
}
