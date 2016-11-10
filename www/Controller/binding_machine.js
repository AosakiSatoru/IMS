/**
 * Created by mac on 16/9/1.
 */

var fetchData;
var category = new Array();
var viewModels = new Array();
var flownameDataSource;

function viewShow() {
	//kendo.mobile.application.showLoading();
	var navbar = $("#navbar").kendoMobileNavBar();
	loadInfoFromService();
	//localtest();
}

function localtest() {
	var data = {
		"outstatus": "0",
		"outputstr": {
			"flowcoderows": [{
				"devices": [{
					"devcode": "c70-1",
					"devcodename": "梳棉一号机"
				}, {
					"devcode": "c70-2",
					"devcodename": "梳棉二号机"
				}, {
					"devcode": "c70-3",
					"devcodename": "梳棉三号机"
				}],
				"flowname": "梳棉",
				"flowcode": "1"
			}, {
				"devices": [{
					"devcode": "b10-1",
					"devcodename": "络筒一号机"
				}],
				"flowname": "络筒",
				"flowcode": "2"
			}]
		}
	}
	loadView(data);
}

function loadInfoFromService() {
	kendo.ui.progress($("#IMSBindingMachine"), true);
	var url = IMSUrl + "busi_bindfind";
	$.ajax({
		type: "post",
		url: url,
		async: true,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify({
				"type": "0"
			})
		},
		dataType: "json",
		success: function(data) {
			kendo.ui.progress($("#IMSBindingMachine"), false);
			kendo.mobile.application.hideLoading();
			loadView(data);
			
		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSBindingMachine"), false);
			kendo.mobile.application.hideLoading();
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
					"flowname": value.flowname,
					"devcode":value2.devcode
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
		bindingView();
	}

}

function bindingView() {
	//返回键

	var flownameViewModel = kendo.observable({
		"flownameDataSource": flownameDataSource,
		collapsibleButtonClick: function(e) {
			var element = e.target.parent().parent().parent().parent();
			var collapsible = element.data("kendoMobileCollapsible");
			collapsible.options.animation = false;
			collapsible.toggle();
			collapsible.options.animation = true;
			//  $(button).find(".km-text").text("未全选");

			var selectAll = $(e.target).attr("isselect") == "NO";
			var inputs = $(element).find("input");
			for(var input in inputs) {
				if(inputs[input].type == "checkbox" && inputs[input].checked != selectAll) {
					inputs[input].click();
				}
			}
			//  $(element).find("li").click();

		}
	});
	kendo.bind($("#bindingMachineListView"), flownameViewModel);
	$.each(fetchData, function(n, value) {
		var viewModel = new kendo.observable({
			devices: [],
			flowname: value.flowname,
			flowcode: value.flowcode,
			selectMachinerows: [],
			alldevices: value.devices,
			select: function(e) {
				if(e.target.checked) {

					$(e.target.parentElement).find("span")[0].style.backgroundImage = 'url("../resources/@3x/selected@3x.png")';

				} else {

					$(e.target.parentElement).find("span")[0].style.backgroundImage = 'url("../resources/@3x/select@3x.png")';

				}
			},
			//

		});
		kendo.bind($("#" + value.flowname), viewModel);

		viewModel.bind("change", function(e) {
			this.selectMachinerows = [];
            
			for(var device in this.alldevices) {
				for(var device2 in this.devices) {
					
					if(this.alldevices[device].devcode == this.devices[device2]) {
						this.selectMachinerows.push({
							"devcode": this.alldevices[device].devcode
						});
					}
				}
			};
			if(this.alldevices.length == this.devices.length) {
				$("#" + viewModel.flowname + "CheckButton").each(function(n, button) {
					//$(this).attr( "style","float: right;background-image: url(../resources/@3x/selected@3x.png);background-repeat: round;border: 0;width: 27px;height: 27px;right: 2px;position: relative;");
					//$(this).attr("isselect","YES");
				});
				$("#" + viewModel.flowname + "CheckAllButton").each(function(n, button) {
					$(this).attr("style", "float: right;background-image: url(../resources/@3x/selected@3x.png);background-repeat: round;border: 0;width: 27px;height: 27px;");
					$(this).attr("isselect", "YES");
				});
			} else {
				$("#" + viewModel.flowname + "CheckButton").each(function(n, button) {

				});
				$("#" + viewModel.flowname + "CheckAllButton").each(function(n, button) {
					$(this).attr("style", "float: right;background-image: url(../resources/@3x/select@3x.png);background-repeat: round;border: 0;width: 27px;height: 27px;");
					$(this).attr("isselect", "NO");
				});
			};

		});

		viewModels.push(viewModel);

	});

	var footViewModel = kendo.observable({
		unselectedAll: function(e) {

			$("input").each(function(n, value) {
				if(value.type == "checkbox" && value.checked == true) {
					value.click();
				}
			})

		},

		bindingMachine: function(e) {


		}
	});
	kendo.bind($("footer"), footViewModel);

	//加载绑定过的信息
	loadHistoryInfo();
}
//上次选择的机台
function loadHistoryInfo() {
	var array = JSON.parse(storage.get("machinerows"))?JSON.parse(storage.get("machinerows")):[];


	var selects = new Array();
	$.each(array,function (index,item) {
		//var flowcode = item.flowcode;
		//console.log(item);
		var devcodes  = item.devcodes.split(',');
		selects = selects.concat(devcodes);

	});
	console.log(selects);
	$.each($("input.km-widget.km-icon.km-check"),function (index,checkbox) {
       var devcode = $(checkbox).attr("value");
		if($.inArray(devcode, selects)!=-1){
			checkbox.click();
		}
			// $.each(selects,function (index,select_devcode) {
			// 	if(devcode==select_devcode){
			// 		checkbox.click();
			// 	}
			// });
	});
}

$("#bindingMachine_confirmButton").click(function(){
	var flowcoderows = new Array();
			$.each(viewModels, function(n, viewModel) {
				if(viewModel.selectMachinerows.length > 0) {

					flowcoderows.push({
						"flowcode": viewModel.flowcode,
						"machinerows": viewModel.selectMachinerows
					});
				}
			});
			var params = {
				"account": storage.get("account"),
				"srcid": storage.get("srcid"),
				"flowcoderows": flowcoderows
			};




			var url = IMSUrl + "busi_binding/";
			$.ajax({
				type: "post",
				url: url,
				timeout: 10000,
				async: false,
				dataType: "jsonp",
				data: {
					"parameter": JSON.stringify(params),
				},
				dataType: "json",
				success: function(data) {
					if(data.outstatus == 0) {
						logInfo(flowcoderows);
						alert("成功");
					} else {
						alert("失败,原因:" + data.outputstr);
					}
				},
				error: function(data, status, e) {

					alert("请求服务器出错");
				}
			});
});
//记录绑定机台
function logInfo(flowcoderows) {
	var history =  new Array();
	$.each(flowcoderows,function (index,object) {
		var flowcode = object.flowcode;
		var devcodes = object.machinerows;

		var ss = devcodes.reduce(function(prev, current, index, array){
			if (index === 0){
				return current.devcode;
			}
			{
				return prev + ',' + current.devcode;
			}
		}, '');
		var item = {"flowcode":flowcode,"devcodes":ss};
		history.push(item);


	});

	storage.put("machinerows", JSON.stringify(history));
}