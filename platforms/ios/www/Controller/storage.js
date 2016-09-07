var Class = {
create: function() {
    return function() {
        this.initialize.apply(this, arguments);
    }
}
}

/* 系统对象，包含一些系统常用函数 */
var StorageLocal = function() {
    
}
var StorageSession = function() {
    
}

StorageLocal.prototype.createDB = function() {
    var db;
    try {
        if(!window.openDatabase) {
            
            //          layer.open({
            //              content: '该浏览器不支持数据库',
            //              btn: ['确定']
            //          });
            alert("该浏览器不支持数据库");
            return false;
        }
        db = openDatabase('hrdb', '', 'My Database', 102400);
    } catch(e) {
        if(e == 2) {
            //          layer.open({
            //              content: '数据库版本无效',
            //              btn: ['确定']
            //          });
            alert("数据版本无效");
            return false;
        } else {
            //          layer.open({
            //              content: "," + e + ".",
            //              btn: ['确定']
            //          });
            alert(',' + e + '.');
            return false;
        }
    }
    return db;
}

StorageLocal.prototype.loadXmlFile = function(xmlFile) //xmlFile 是xml文件的地址
{
    var xmlDom = null;
    if(window.ActiveXObject) //IE浏览器中读取xml文件
    {
        xmlDom = new ActiveXObject("Microsoft.XMLDOM");
        xmlDom.async = "false";
        xmlDom.load(xmlFile);
    } else if(document.implementation && document.implementation.createDocument) {
        //Firefox，Chrome 浏览器中读取xml文件
        var xmlhttp = new window.XMLHttpRequest();
        xmlhttp.open("GET", xmlFile, false);
        xmlhttp.send(null);
        xmlDom = xmlhttp.responseXML;
    } else {
        xmlDom = null;
    }
    return xmlDom;
}

StorageLocal.prototype.getWebService = function() {
    //生成关键词链接
    var xdoc = storage.loadXmlFile("webservice.xml")
    //var list=xdoc.selectNodes("//keys")//只能在Ie浏览器中获取
    var list = xdoc.getElementsByTagName("keys"); //读取所有节点值
    for(var i = 0; i < list.length; i++) {
        if(list[i].getAttribute("key") == "url") {
            storage.remove("webUrl");
            var webUrl = list[i].getAttribute("value");
            storage.put("webUrl", webUrl);
            return webUrl;
        }
    }
}

Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format = format.replace(RegExp.$1,
                                                    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                                    RegExp.$1.length == 1 ? o[k] :
                                    ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

StorageLocal.prototype.put = function(key, value) {
    window.localStorage.setItem(key, escape(value));
}

StorageLocal.prototype.get = function(key) {
    var val = window.localStorage.getItem(key);
    if(val != null) {
        return unescape(val);
    }
    return val;
}

StorageLocal.prototype.remove = function(key) {
    window.localStorage.removeItem(key);
}

StorageLocal.prototype.clear = function() {
    window.localStorage.clear();
}

StorageLocal.prototype.update = function(key, value) {
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, escape(value));
}
StorageLocal.prototype.setCookie = function(name, value, exptime) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 1 * exptime * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
StorageLocal.prototype.getCookie = function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
}
StorageLocal.prototype.delCookie = function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = storage.getCookie(name);
    if(cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//StorageLocal.prototype.checkLen = function (v) {
//    if (checkLen.substr(0,1)==)
//    window.localStorage.removeItem(key);
//}

StorageLocal.prototype.newGuid = function() {
    var guid = "";
    for(var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}
var handle; //事件柄

var browser = {
versions: function() {
    var u = navigator.userAgent,
    app = navigator.appVersion;
    return { //移动终端浏览器版本信息
    trident: u.indexOf("Trident") > -1, //IE内核
    presto: u.indexOf("Presto") > -1, //opera内核
    webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
    gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                   android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
                   iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
                   iPad: u.indexOf("iPad") > -1, //是否iPad
                   webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
                   };
                   }(),
                   language: (navigator.browserLanguage || navigator.language).toLowerCase()
                   }
                   
                   var storage = new StorageLocal();