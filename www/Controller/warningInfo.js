/**
 * Created by mac on 16/9/7.
 */

var navbar = $("#navbar").kendoMobileNavBar();
function viewShow(){
	
	dataSource = kendo.data.DataSource.create({
		data: [{message:"告警信息"}, 
		{message:"设备告警信息"}, 
		{message:"生产效率详细告警信息"}, 
		{message:""}]
	});

	var contentViewModel = kendo.observable({
		"dataSource": dataSource,

	});
	kendo.bind($("#warningInfoListView"), contentViewModel);
	$("#warningInfo_detilButton").click(function() {
//				window.location.href = "warningDetail.html";
				app.navigate("warningDetail.html");
			});
			
    			webRequest(false,"2");
}
// BOOL onlyShowBindingMachine -- "type":"1" 只显示绑定机台
//messsage id 消息类型
function webRequest(onlyShowBindingMachine,messageid){
	var params ;
	if(onlyShowBindingMachine){
	 params = {
					"messageid" : messageid,
					"account": storage.get("account"),
					"srcid": storage.get("srcid"),
					"type":"1"};
	}else{
		params = {
					"messageid" : messageid,
					"account": storage.get("account"),
					"srcid": storage.get("srcid"),
					};
	}
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
