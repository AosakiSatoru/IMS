/**
 * Created by Satoru on 16/9/20.
 */

$(document).ready(function() {

	dataSource = kendo.data.DataSource.create({
		data: [{},{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
	});

	var contentViewModel = kendo.observable({
		"dataSource": dataSource,

	});
	kendo.bind($("#contentListView"), contentViewModel);
});