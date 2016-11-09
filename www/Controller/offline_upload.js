/**
 * Created by mac on 2016/11/8.
 */
function viewShow(){
    //var content = JSON.parse(storage.get("offline"));
   var content = JSON.parse(storage.get("offline"));
    content  = content.filter(function (item) {
       return !(item.status== "success");
    });


    content = content.map(function(item) {
        return {
            type: item.type,
            operatetime: item.operatetime,
            content: dealWithContent(JSON.stringify(item.content)),
            status: item.status
        }

    });
    var listViewModel = new kendo.observable({
        dataSource: content,
    });
    kendo.bind($("#offlineUploadListView"), listViewModel);



    $("#submit").click(function () {


    });





}
//让展示信息可读
function  dealWithContent(content) {
    return content.replace(/[{"}]/g,"")
                  .replace(/typerows/,"内容")
                  .replace(/flowcoderows/,"内容")
                  .replace(/unit/g,"单位")
                  .replace(/yield/g,"产量")
                  .replace(/shiftdate/,"时间")
                  .replace(/username/g,"操作人")
                  .replace(/type/g,"类别")
                  .replace(/shiftdate/g,"时间")
                  .replace(/flowcode/g,"工序号")
                  .replace(/machinerows/g,"机台")
                  .replace(/devcode/g,"机台号")
                  .replace(/varieties/g,"品种")


}
