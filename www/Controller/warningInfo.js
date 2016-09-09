/**
 * Created by mac on 16/9/7.
 */

$(document).ready(function() {

	dataSource = kendo.data.DataSource.create({
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
		}]
	});

	var contentViewModel = kendo.observable({
		"dataSource": dataSource,

	});
	kendo.bind($("#contentListView"), contentViewModel);
});