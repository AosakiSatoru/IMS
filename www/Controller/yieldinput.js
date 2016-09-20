/**
 * Created by mac on 16/9/6.
 */
var contentViewModel;
function request(paras){
　　var url = location.href;
　　var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
　　var paraObj = {}
　　for (i=0; j=paraString[i]; i++){
　　paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
　　}
　　var returnValue = paraObj[paras.toLowerCase()];
　　if(typeof(returnValue)=="undefined"){
　　return "";
　　}else{
　　return returnValue;
　　}
}
function getDuty(){
	var result = "";
	
   switch(request("type")){
   	case "1":
   	result = "甲";
   	break;
   	case "2":
   	result = "乙";
   	break;
   	case "3":
   	result = "丙";
   	break;
   }
  return result;
}
$(document).ready(function () {
//	  $("#dropdownlist").kendoDropDownList({
//change: function(e) {
//	alert("233");
//}
//});
	
	
	
    var headerButtonViewModel = kendo.observable({
        headerButtonClick: function (e) {
           $.each(e.target.parent().parent().find("a"),function (n,button) {
               button.style.backgroundColor = "#EEEEEE";
               button.style.color           = "#AAAAAA";
               button.style.borderColor     = "#EEEEEE";
           });
            e.target[0].style.backgroundColor = "#A9293D";
            e.target[0].style.color           = "#FFFFFF";
            e.target[0].style.borderColor     = "#A9293D";

            if($(e.target.find(".km-text")[0]).text()=="预并"){
			 contentViewModel.selectflowcode = 2;
			 $("#contentListView").data("kendoMobileListView").setDataSource(kendo.data.DataSource.create({
					data:self.contentViewModel.first	
				    }) );
            }else if($(e.target.find(".km-text")[0]).text()=="梳棉"){
			contentViewModel.selectflowcode = 1;
            $("#contentListView").data("kendoMobileListView").setDataSource(kendo.data.DataSource.create({
					data:self.contentViewModel.second	
				    }) );
            }else if($(e.target.find(".km-text")[0]).text()=="粗纱"){
            	contentViewModel.selectflowcode = 3;
					$("#contentListView").data("kendoMobileListView").setDataSource(kendo.data.DataSource.create({
					data:self.contentViewModel.third	
				    }) );
            }

			$("#contentListView").data("kendoMobileListView").refresh( );

        }

    });
    
     var url = IMSUrl+"busi_bindfind";
    $.ajax({
           type: "post",
           url: url,
           timeout: 10000,
           async: false,
           dataType: "jsonp",
           data: {
           "parameter": JSON.stringify({
                                       "type": "1"
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
    
    
    
    
    kendo.bind($("#headerButtonGroup"),headerButtonViewModel);

});
function bindView(data){
	    var first,second,third;
		var content = data.outputstr.flowcoderows;
		
		for (var key in content){
			var object = content[key];
			var contentArray = new Array();
			
			if(object.flowcode=="2"){
				$.each(object.devices,function(n,device){
				contentArray.push({"image":"../resources/@3x/ybt-sb2@3x.png","devcodename":device["devcodename"],"devcode":device["devcode"],"yield":"","variety":""});
			});
//				
				first = contentArray;
			}else if(object.flowcode=="1"){
				$.each(object.devices,function(n,device){
				contentArray.push({"image":"../resources/@3x/smj-c51@3x.png","devcodename":device["devcodename"],"devcode":device["devcode"],"yield":"","variety":""});
			});
//				
				second = contentArray;
			}else if(object.flowcode=="3"){
				$.each(object.devices,function(n,device){
				contentArray.push({"image":"../resources/@3x/csj-ftid@3x.png","devcodename":device["devcodename"],"devcode":device["devcode"],"yield":"","variety":""});
			});
				third = contentArray;
//				
			}
			
		}
	 varietiesDataSource  = kendo.data.DataSource.create({
        data: [
            {"variety":"type1"},{"variety":"type2"}
        ]
    });
    contentDataSource = kendo.data.DataSource.create({
					data:first	
				    }); 
    	    contentViewModel = kendo.observable({
    	    	 "selectflowcode": 2,
        "varietiesDataSource": varietiesDataSource,
		"contentDataSource":contentDataSource,
		"first":first,
		"second":second,
		"third":third,
		onChange:function(e){
			$(e.sender.element.parent().parent()).find("#dropdownlistPlaceholder").hide();
		},
		hidden:function(e){
			return !(e.variety.length==0);
		}
    });
    kendo.bind($("#contentListView"), contentViewModel);
  	var dropdownlist = $("#dropdownlist").data("kendoDropDownList");
//	dropdownlist.bind("change", function(e){
//		alert("233");
//	});

  	
  	var footerViewModel = kendo.observable({
  		input: function (e){
  		  var content = 
  		 
		  $("#contentListView").data("kendoMobileListView").dataSource.data().map(function(item){
				var obj = {
					devcode1:item.devcode,
					yield:item.yield,
					varieties:item.variety
				};
			return obj;
	});
	   var params = {
	   	duty:getDuty(),
	   	flowcoderows:[{
	   		flowcode:contentViewModel.selectflowcode,
	   		machinerows:content
	   	}]
	   };
  	     $.ajax({
                    type: "post",
                     url: IMSUrl + "busi_YieldInput/",
                 timeout: 10000,
                   async: false,
                dataType: "jsonp",
                     data: {
                           "parameter": JSON.stringify(params),
                            },
                              dataType: "json",
                              success: function(data) {
                                                              if(data.outstatus == 0) {
                                                              alert("成功");
                                                              } else {
                                                              alert("失败,原因:" + data.outputstr);
                                                              }
                                                              },
                                                              error: function(data, status, e) {
                                                              
                                                              alert("请求服务器出错");
                                                              }
                                                              });
	   
	   
	   
  		},
  	});
  
  	
  	kendo.bind($("#footer"), footerViewModel);
}



