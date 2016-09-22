var app = new kendo.mobile.Application(document.body,
    {
        platform:'ios',
        skin:'nova'
    });
function postPackingInputData(Type) {
    var unit;
    var count;
    if(Type == "回条") {
        unit = $("#dropdownlist1").val();
        count = $("#IMSPackingInput_first_yield").val();
    } else if(Type == "粗纱头") {
        unit = $("#dropdownlist2").val();
        count = $("#IMSPackingInput_second_yield").val();
    } else if(Type == "白花") {
        unit = $("#dropdownlist3").val();
        count = $("#IMSPackingInput_third_yield").val();
    }
    var typerows = [{
                    "unit": unit,
                    "yield": count,
                    "date": new Date().toUTCString(),
                    "type": storage.get("flowcode") == "undefined" ? "" : storage.get("flowcode")
                    }];
    var para = {
        "typerows": typerows
    };
    
    if(count.length == 0) {
        alert("请输入数量");
        return;
    }
    var url = IMSUrl + "busi_PackingInput/";
    $.ajax({
           type: "post",
           url: url,
           timeout: 10000,
           async: true,
           dataType: "jsonp",
           data: {
           "parameter": JSON.stringify(para)
           },
           dataType: "json",
           success: function(data) {
           if(data.outstatus == 0)
           alert("处理成功");
           else
           alert("操作失败，请稍后再试");
           },
           error: function(data, status, e) {
           alert("请求服务器出错");
           }
           });
};

$(document).ready(function() {
                  $("#packingInput_confirmButton_1").click(function() {
                                                           postPackingInputData("回条");
                                                           });
                  $("#packingInput_confirmButton_2").click(function() {
                                                           postPackingInputData("粗纱头");
                                                           });
                  $("#packingInput_confirmButton_3").click(function() {
                                                           postPackingInputData("白花");
                                                           });
                  $("#dropdownlist1").kendoDropDownList();
                  $("#dropdownlist2").kendoDropDownList();
                  $("#dropdownlist3").kendoDropDownList();
                 });