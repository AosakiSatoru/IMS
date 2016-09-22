/**
 * Created by Satoru on 16/9/20.
 */
var navbar = $("#navbar").kendoMobileNavBar();
var app = new kendo.mobile.Application(document.body, {
	platform: 'ios',
	skin: 'nova'
});
$(document).ready(function() {

	dataSource = kendo.data.DataSource.create({
		data: [{},{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
	});

	var contentViewModel = kendo.observable({
		"dataSource": dataSource,

	});
	kendo.bind($("#contentListView"), contentViewModel);
});