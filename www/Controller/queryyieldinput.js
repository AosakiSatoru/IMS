function viewInit(){
	$("#startTimeDatepicker1").kendoDatePicker({
	animation: false,
	culture: "zh-CN",
	format: "yyyy-MM-dd"
});
$("#startTimeDatepicker2").kendoDatePicker({
	animation: false,
	culture: "zh-CN",
	format: "yyyy-MM-dd"
});

}
function viewShow(){
	var dataSource = kendo.data.DataSource.create({
		data: [{},{},{}],
	});
	var listViewModel = new kendo.observable({
		queryResultDataSource:dataSource
	});
	kendo.bind($("#listview"), listViewModel);
	
}
