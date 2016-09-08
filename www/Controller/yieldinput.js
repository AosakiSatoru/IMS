/**
 * Created by mac on 16/9/6.
 */
var contentViewModel;

$(document).ready(function () {
    var headerButtonViewModel = kendo.observable({
        headerButtonClick: function (e) {
           $.each(e.target.parent().parent().find("a"),function (n,button) {
              button.style.backgroundColor = "#EEEEEE";
               button.style.color          = "#AAAAAA";
           });
            e.target[0].style.backgroundColor = "#A9293D";
            e.target[0].style.color        = "#FFFFFF";

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
				contentArray.push({"image":"../resources/@3x/预并条：SB2@3x.png","devcodename":device["devcodename"],"devcode":device["devcode"],"yield":"233","variety":"233"});
			});
//				
				first = contentArray;
			}else if(object.flowcode=="1"){
				$.each(object.devices,function(n,device){
				contentArray.push({"image":"../resources/@3x/梳棉机：型号c51@3x.png","devcodename":device["devcodename"],"devcode":device["devcode"],"yield":"","variety":"233"});
			});
//				
				second = contentArray;
			}else if(object.flowcode=="3"){
				$.each(object.devices,function(n,device){
				contentArray.push({"image":"../resources/@3x/粗纱机：FTID@3x.png","devcodename":device["devcodename"],"devcode":device["devcode"],"yield":"","variety":""});
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
		"third":third
    });
    kendo.bind($("#contentListView"), contentViewModel);
  	
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
	   	duty:"123",
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



