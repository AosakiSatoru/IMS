/**
 * Created by mac on 16/9/1.
 */
var app = new kendo.mobile.Application();
var fetchData;
var category = new Array();
var viewModels = new Array();
var  flownameDataSource ;
loadInfoFromService();

function loadInfoFromService() {
    $.ajax({
        type: "post",
        url: "http://10.0.0.254:8080/service/ws/api/rest/busi_bindfind",
        timeout: 1000,
        async: false,
        dataType: "jsonp",
        data: {
            "parameter": JSON.stringify({"type": "0"})
        },
        dataType: "json",
        success: function (data) {

            loadView(data);
        },
        error: function (data, status, e) {

            alert("请求服务器出错");
        }
    });
}
function loadView(data) {
    viewModels = [];

    if (data.outstatus != 0) {
        alert(data.outputstr);
    } else if (data.outstatus == 0) {
        var category = new Array();
        fetchData = data.outputstr.flowcoderows;
        $.each(fetchData, function (n, value) {

            category.push({
                "flowname": value.flowname,
                "deviceDataSource": value.flowname + "binding_machine_database",
                "flownameid": value.flowname
            });
            var devices = new Array();

            $.each(value.devices, function (n, value2) {
                devices.push({"device": value2.devcodename, "flowname": value.flowname});
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
    var flownameViewModel = kendo.observable({
        "flownameDataSource": flownameDataSource,
        collapsibleButtonClick : function (e) {
            var element     =  e.target.parent().parent().parent().parent();
            var collapsible =  element.data("kendoMobileCollapsible");
            collapsible.toggle();
          //  $(button).find(".km-text").text("未全选");

            var selectAll = $(e.target).find(".km-text").text()=="全选";
            var inputs = $(element).find("input");
            for (var input in inputs){
                if(inputs[input].type == "checkbox"&&inputs[input].checked!=selectAll){
                    inputs[input].click();
                }
            }
            //  $(element).find("li").click();

        }
    });
    kendo.bind($("#contentListView"), flownameViewModel);

    $.each(fetchData, function (n, value) {
        var viewModel = new kendo.observable({
            devices: [],
            flowname: value.flowname,
            flowcode: value.flowcode,
            selectMachinerows: [],
            alldevices: value.devices,

        });
        kendo.bind($("#" + value.flowname), viewModel);

        viewModel.bind("change", function (e) {
            this.selectMachinerows = [];

            for (var device in this.alldevices) {
                for (var device2 in this.devices) {
                    if (this.alldevices[device].devcodename == this.devices[device2]) {
                        this.selectMachinerows.push({"devcode": this.alldevices[device].devcode});
                    }
                }
            };
            if (this.alldevices.length == this.devices.length){
                $("#"+viewModel.flowname+"CheckButton").each(function (n,button) {
                    $(button).find(".km-text").text("未全选");
                });
            }else {
                $("#"+viewModel.flowname+"CheckButton").each(function (n,button) {
                    $(button).find(".km-text").text("全选");
                });
            };



        });

        viewModels.push(viewModel);



    });


    var footViewModel = kendo.observable({
        unselectedAll: function (e) {

            $("input").each(function (n,value) {
                if (value.type == "checkbox"&&value.checked==true){
                    value.click();
                }
            })


        },

        bindingMachine: function (e) {

            var flowcoderows = new Array();
            $.each(viewModels, function (n, viewModel) {
                //  $("#"+value.flowname).data("kendoListView").dataSource.read();
                // $("#" + value.flowname).data("kendoListView").refresh();
                if (viewModel.selectMachinerows.length > 0) {
                    flowcoderows.push({"flowcode": viewModel.flowcode, "machinerows": viewModel.selectMachinerows})
                }
            });

            var params = {
                "account": "0",
                "srcid": "",
                "flowcoderows": flowcoderows
            };
            $.ajax({
                type: "post",
                url: "http://10.0.0.254:8080/service/ws/api/rest/busi_binding",
                timeout: 1000,
                async: false,
                dataType: "jsonp",
                data: {
                    "parameter": JSON.stringify(params),
                },
                dataType: "json",
                success: function (data) {
                    if (data.outstatus == 0) {
                        alert("成功");
                    } else {
                        alert("失败,原因:" + data.outputstr);
                    }
                },
                error: function (data, status, e) {

                    alert("请求服务器出错");
                }
            });
        }
    });
    kendo.bind($("footer"), footViewModel);
});

