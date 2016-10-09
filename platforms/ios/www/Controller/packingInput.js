
function postPackingInputData(Type) {
    var unit;
    var count;
    var type;
    if(Type == "回条") {
        unit = $("#dropdownlist1").val();
        count = $("#IMSPackingInput_first_yield").val();
        type = "0";
    } else if(Type == "粗纱头") {
        unit = $("#dropdownlist2").val();
        count = $("#IMSPackingInput_second_yield").val();
        type = "1";
    } else if(Type == "白花") {
        unit = $("#dropdownlist3").val();
        count = $("#IMSPackingInput_third_yield").val();
        type = "2";
    }
    var typerows = [{
                    "unit": unit,
                    "yield": count,
                    "type": type
                    }];
    var para = {
        "typerows": typerows,
        "username":storage.get("srcid"),
    };
    
    if(count.length == 0) {
        alert("请输入数量");
        return;
    }
    var url = IMSUrl + "busi_PackingInput/";
    kendo.ui.progress($("body"), true);
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
           	 kendo.ui.progress($("body"), false);
           if(data.outstatus == 0)
           alert("处理成功");
           else
           alert("操作失败，请稍后再试");
           },
           error: function(data, status, e) {
           	 kendo.ui.progress($("body"), false);
           alert("请求服务器出错");
           }
           });
};
function viewShow(){
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
}
$(document).ready(function() {

                 });