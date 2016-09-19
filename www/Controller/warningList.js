/**
 * Created by Satoru on 16/9/18.
 */

loadInfoFromService();

function loadInfoFromService() {
    var url = IMSUrl+"busi_alarm";
    $.ajax({
           type: "post",
           url: url,
           timeout: 10000,
           async: false,
           dataType: "jsonp",
           data: {
           "parameter": JSON.stringify({
           								"messageid":"1",
                                       	"type": "1",
                                       	"account",storage.get("account") == "undefined" ? "" : storage.get("account"),
                                       	"srcid",storage.get("srcid") == "undefined" ? "" : storage.get("srcid")
                                       })
           },
           dataType: "json",
           success: function(data) {
	           bindView(data);
           },
           error: function(data, status, e) {
           
           alert("请求服务器出错");
           }
           });
}

function loadView(data) {
    viewModels = [];
    
    if(data.outstatus != 0) {
        alert(data.outputstr);
    } else if(data.outstatus == 0) {
        var category = new Array();
        fetchData = data.outputstr.flowcoderows;
        $.each(fetchData, function(n, value) {
               
               category.push({
                             "flowname": value.flowname,
                             "deviceDataSource": value.flowname + "binding_machine_database",
                             "flownameid": value.flowname
                             });
               var devices = new Array();
               
               $.each(value.devices, function(n, value2) {
                      devices.push({
                                   "device": value2.devcodename,
                                   "flowname": value.flowname
                                   });
                      });
               anObjectName = value.flowname + "binding_machine_database";
               window[anObjectName] = kendo.data.DataSource.create({
                                                                   data: devices,
                                                                   });
               console.log(value.flowname);
               
               });
        
        flownameDataSource = kendo.data.DataSource.create({
                                                          data: category,
                                                          });
        
    }
    
}
$(document).ready(function () {
    
     

});