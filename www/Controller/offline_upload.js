/**
 * Created by mac on 2016/11/8.
 */
var listViewModel;

function viewShow(){
    //var content = JSON.parse(storage.get("offline"));

    listViewModel = new kendo.observable({
        dataSource: loadInfo(),
        deleteItem:function (e) {
            console.log(e.data.status);
            e.data.status="删除";
            changeLog();
            $("#offlineUploadListView").data("kendoMobileListView").setDataSource(loadInfo());


        }
    });
    kendo.bind($("#offlineUploadListView"), listViewModel);



    $("#submit").click(function () {
      //  kendo.ui.progress($("#offline_upload"), true);
        $(listViewModel.dataSource).each(function (index,element) {
            //console.log(element);

            var url ="";
            if(element.type=="副料打包"){
                url = IMSUrl + "busi_PackingInput/";
            }else if(element.type=="机台输入产量"){
                url = IMSUrl+"busi_YieldInput/";
            }

            $.ajax({
                type: "post",
                url: url,
                timeout: 10000,
                async: false,
                dataType: "jsonp",
                data: {
                    "parameter":element.content,
                },
                dataType: "json",
                success: function(data) {

                    if(data.outstatus == 0) {

                        element.status="成功";
                    } else {
                        element.status="失败,原因:" + data.outputstr;
                    }
                },
                error: function(data, status, e) {
                    // kendo.ui.progress($("#IMSYieldinput"), false);
                    if (e == "timeout"){
                        element.status ="超时";
                    }else{
                        element.status="请求服务器出错";
                    }

                }
            });

    });

        changeLog();
        $("#offlineUploadListView").data("kendoMobileListView").setDataSource(loadInfo());

        });



}
//修改记录
function changeLog() {


  var  content  = $("#offlineUploadListView").data("kendoMobileListView").dataSource.data().filter(function (item) {
        return !(item.status== "成功"||item.status== "删除");
    });

    if(content ==null){
        content = new Array();
    }

    content = content.map(function(item) {

        return {
            type: item.type,
            operatetime: item.operatetime,
            info:item.info,
            content: item.content,
            status: item.status
        }

    });

    storage.put("offline",JSON.stringify(content));

}
function  loadInfo() {

    var content = JSON.parse(storage.get("offline"));


    if (content ==null){
        return [];
    }

    content = content.map(function(item) {
        return {
            type: item.type,
            operatetime: item.operatetime,
            info: item.info,
            content:item.content,
            status: item.status
        }

    });
    return content;
}

