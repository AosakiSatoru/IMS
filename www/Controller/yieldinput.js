/**
 * Created by mac on 16/9/6.
 */
var contentViewModel;
var type;
var selectdate;

function viewInit(e) {}

function viewShow(e) {

	var navbar = $("#navbar").kendoMobileNavBar();
	selectdate = e.view.params.selectdate;
	switch(e.view.params.type) {
		case "0":
			type = "1";
			break;
		case "1":
			type = "2";
			break;
		case "2":
			type = "3";
	};
	kendo.ui.progress($("#IMSYieldinput"), true);
	var url = IMSUrl + "busi_bindfind";
	$.ajax({
		type: "post",
		url: url,
		async: true,
		dataType: "jsonp",
		data: {
			"parameter": JSON.stringify({
				"type": "1"
			})
		},
		dataType: "json",
		success: function(data) {
			kendo.ui.progress($("#IMSYieldinput"), false);
			//			kendo.mobile.application.hideLoading();
			bindView(data);
		},
		error: function(data, status, e) {
			//			kendo.mobile.application.hideLoading();
			kendo.ui.progress($("#IMSYieldinput"), false);
			alert("请求服务器出错!原因:" + JSON.stringify(data));
		}
	});
}

function fetchXJS() {
	var url = IMSUrl + "findxjs/";
	var result = [];
	kendo.ui.progress($("#IMSYieldinput"), true);
	$.ajax({
		type: "post",
		url: url,
		async: false,
		dataType: "jsonp",
		data: null,
		dataType: "json",
		success: function(data) {
			kendo.ui.progress($("#IMSYieldinput"), false);
			result = data.outputstr.map(function(item) {
				return {
					variety: item.XJS_No
				};
			});

		},
		error: function(data, status, e) {
			kendo.ui.progress($("#IMSYieldinput"), false);
		}
	});
	return result;
}

function bindView(data) {
	var first, second, third;
	var content = data.outputstr.flowcoderows;

	for(var key in content) {
		var object = content[key];
		var contentArray = new Array();

		if(object.flowcode == "2") {
			$.each(object.devices, function(n, device) {
				contentArray.push({
					"image": "../resources/@3x/ybt-sb2@3x.png",
					"devcodename": device["devcodename"],
					"devcode": device["devcode"],
					"yield": "",
					"variety": ""
				});
			});
			//
			first =
				kendo.data.DataSource.create({
					data: contentArray
				});
		} else if(object.flowcode == "1") {
			$.each(object.devices, function(n, device) {
				contentArray.push({
					"image": "../resources/@3x/smj-c51@3x.png",
					"devcodename": device["devcodename"],
					"devcode": device["devcode"],
					"yield": "",
					"variety": ""
				});
			});
			//
			second =
				kendo.data.DataSource.create({
					data: contentArray
				});
		} else if(object.flowcode == "3") {
			$.each(object.devices, function(n, device) {
				contentArray.push({
					"image": "../resources/@3x/csj-ftid@3x.png",
					"devcodename": device["devcodename"],
					"devcode": device["devcode"],
					"yield": "",
					"variety": ""
				});
			});
			third =
				kendo.data.DataSource.create({
					data: contentArray
				});
			//
		}

	}
	varietiesDataSource = kendo.data.DataSource.create({
		data: fetchXJS(),
	});
	contentDataSource = first;
	contentViewModel = kendo.observable({
		"selectflowcode": 2,
		"varietiesDataSource": varietiesDataSource,
		"contentDataSource": contentDataSource,
		"first": first,
		"second": second,
		"third": third,
		onChange: function(e) {
			console.log($(e.target).parent());
			
			$(e.target).parent().find("#dropdownlistPlaceholder").hide();
		},
		hidden: function(e) {
			return !(e.variety.length == 0);
		}
	});

	var headerButtonViewModel = kendo.observable({
		headerButtonClick: function(e) {
			$.each(e.target.parent().parent().find("a"), function(n, button) {
				button.style.backgroundColor = "#EEEEEE";
				button.style.color = "#AAAAAA";
				button.style.borderColor = "#EEEEEE";
			});
			e.target[0].style.backgroundColor = "#A9293D";
			e.target[0].style.color = "#FFFFFF";
			e.target[0].style.borderColor = "#A9293D";

			if($(e.target.find(".km-text")[0]).text() == "预并") {
				contentViewModel.selectflowcode = 2;
				$("#yieldInputListView").data("kendoMobileListView").setDataSource(self.contentViewModel.first);
			} else if($(e.target.find(".km-text")[0]).text() == "梳棉") {
				contentViewModel.selectflowcode = 1;
				$("#yieldInputListView").data("kendoMobileListView").setDataSource(self.contentViewModel.second);
			} else if($(e.target.find(".km-text")[0]).text() == "粗纱") {
				contentViewModel.selectflowcode = 3;
				$("#yieldInputListView").data("kendoMobileListView").setDataSource(self.contentViewModel.third);
			}

		}

	});
	kendo.bind($("#headerButtonGroup"), headerButtonViewModel);

	//刷新头部
	$.each($("#headerButtonGroup").find("a"), function(n, button) {
		if(n == 0) {
			button.style.backgroundColor = "#A9293D";
			button.style.color = "#FFFFFF";
			button.style.borderColor = "#A9293D";
		} else {
			button.style.backgroundColor = "#EEEEEE";
			button.style.color = "#AAAAAA";
			button.style.borderColor = "#EEEEEE";
		}
	});

	kendo.bind($("#yieldInputListView"), contentViewModel);

	var footerViewModel = kendo.observable({
		input: function(e) {
			var content =

				$("#yieldInputListView").data("kendoMobileListView").dataSource.data().map(function(item) {
					var obj = {
						devcode: item.devcode,
						yield: item.yield,
						varieties: item.variety
					};
					return obj;
				});
			//对客户输入的信息的每一项进行校验，没输入的不输出，输入一半的提示出错
			var filterContent = new Array();
			for(var index in content) {
				var item = content[index];

				if(item.yield.length == 0 && item.varieties.length == 0) {
					continue;
				} else if(item.yield.length == 0 || item.varieties.length == 0) {
					alert("某项的品种或数量没有填写！");
					return;
				} else {
					filterContent.push(item);
				}
			}
			//alert(JSON.stringify(filterContent));
			//return ;
			var params = {
				duty: type,
				shiftdate: selectdate,
				flowcoderows: [{
					flowcode: contentViewModel.selectflowcode,
					machinerows: filterContent
				}]
			};

			kendo.ui.progress($("#IMSYieldinput"), true);
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
					kendo.ui.progress($("#IMSYieldinput"), false);
					if(data.outstatus == 0) {
						alert("成功");
					} else {
						alert("失败,原因:" + data.outputstr);
					}
				},
				error: function(data, status, e) {
					kendo.ui.progress($("#IMSYieldinput"), false);
					alert("请求服务器出错");
				}
			});

		},
	});

	kendo.bind($("#footer"), footerViewModel);
}