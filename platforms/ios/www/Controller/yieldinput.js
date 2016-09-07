/**
 * Created by mac on 16/9/6.
 */

$(document).ready(function () {
    var headerButtonViewModel = kendo.observable({
        headerButtonClick: function (e) {
           $.each(e.target.parent().parent().find("a"),function (n,button) {
              button.style.backgroundColor = "#EEEEEE";
               button.style.color          = "#AAAAAA";
           });
            e.target[0].style.backgroundColor = "#A9293D";
            e.target[0].style.color        = "#FFFFFF";

            if($(e.target.find(".km-text")[0]).text()=="粗纱"){

            }else if($(e.target.find(".km-text")[0]).text()=="梳棉"){

            }else if($(e.target.find(".km-text")[0]).text()=="粗纱"){

            }

        }

    });
    kendo.bind($("#headerButtonGroup"),headerButtonViewModel);

    nameSource = kendo.data.DataSource.create({
        data: [{
            firstName: "Ann",
            lastName: "Devon",
            firstLetter: "A",
            lastLetter: "D",
            photo: '../content/mobile/overview/ann.jpg'
        }, {
            firstName: "Ann",
            lastName: "Devon",
            firstLetter: "A",
            lastLetter: "D",
            photo: '../content/mobile/overview/ann.jpg'
        }, {
            firstName: "Ann",
            lastName: "Devon",
            firstLetter: "A",
            lastLetter: "D",
            photo: '../content/mobile/overview/ann.jpg'
        }, {
            firstName: "Ann",
            lastName: "Devon",
            firstLetter: "A",
            lastLetter: "D",
            photo: '../content/mobile/overview/ann.jpg'
        }, {
            firstName: "Ann",
            lastName: "Devon",
            firstLetter: "A",
            lastLetter: "D",
            photo: '../content/mobile/overview/ann.jpg'
        }, {
            firstName: "Ann",
            lastName: "Devon",
            firstLetter: "A",
            lastLetter: "D",
            photo: '../content/mobile/overview/ann.jpg'
        }, {
            firstName: "Ann",
            lastName: "Devon",
            firstLetter: "A",
            lastLetter: "D",
            photo: '../content/mobile/overview/ann.jpg'
        }, {
            firstName: "Ann",
            lastName: "Devon",
            firstLetter: "A",
            lastLetter: "D",
            photo: '../content/mobile/overview/ann.jpg'
        }, {
            firstName: "Ann",
            lastName: "Devon",
            firstLetter: "A",
            lastLetter: "D",
            photo: '../content/mobile/overview/ann.jpg'
        }]
    });

    var contentViewModel = kendo.observable({
        "nameSource": nameSource,

    });
    kendo.bind($("#contentListView"), contentViewModel);
});



