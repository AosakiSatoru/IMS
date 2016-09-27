/**
 * Created by Satoru on 16/9/20.
 */




function viewShow(){
	var navbar = $("#navbar").kendoMobileNavBar();
	
	dataSource = kendo.data.DataSource.create({
		data: [{},{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
	});

	var contentViewModel = kendo.observable({
		"dataSource": dataSource,

	});
	kendo.bind($("#warningDetailListView"), contentViewModel);
	webRequest("c70-1");
}
function webRequest(devcode){
	
	var  params = {
					"devcode" : devcode,
					"account": storage.get("account"),
					"srcid": storage.get("srcid"),
					"type":"1"};
	
	$.ajax({
           type: "post",
           url: IMSUrl+"devcodeDetail/",
           async: true,
           dataType: "jsonp",
           data: {
           "parameter": JSON.stringify(params)
           },
           dataType: "json",
           success: function(data) {
            alert(JSON.stringify(data.outputstr));
           },
           error: function(data, status, e) {
           alert("请求服务器出错");
           }
           });
	
}