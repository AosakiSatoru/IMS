/**
 * Created by Satoru on 16/9/20.
 */
var navbar = $("#navbar").kendoMobileNavBar();

$(document).ready(function() {

	dataSource = kendo.data.DataSource.create({
		data: [{},{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
	});

	var contentViewModel = kendo.observable({
		"dataSource": dataSource,

	});
	kendo.bind($("#warningDetailListView"), contentViewModel);
});