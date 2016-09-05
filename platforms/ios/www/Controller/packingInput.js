function postPackingInputData(Type) {
    var unit;
    var count;
    if (Type == "回条") {
        unit = $("#dropdownlist1").val();
        count = $("#IMSPackingInput_first_yield").val();
    } else if(Type == "粗纱头"){
        unit = $("#dropdownlist2").val();
        count = $("#IMSPackingInput_second_yield").val();
    } else if (Type == "白花") {
        unit = $("#dropdownlist3").val();
        count = $("#IMSPackingInput_third_yield").val();
    }
    
    var para = {
        "unit": unit,
        "yield": count,
        "typerows": 1,
        "date":new Date().toUTCString(),
        "type":Type
    };
    
    if(count.length == 0) {
        alert("请输入数量");
        return;
    }
    var url = IMSUrl+"busi_PackingInput/";
    $.ajax({
           type: "post",
           url: url,
           timeout: 1000,
           async: true,
           dataType: "jsonp",
           data: {
           "parameter": JSON.stringify(para)
           },
           dataType: "json",
           success: function(data) {
           alert(JSON.stringify(para));
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
                  });