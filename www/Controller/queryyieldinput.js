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
		data: [{itemInfo:"123"},{itemInfo:"123"},{itemInfo:"123"}],
	});
	var listViewModel = new kendo.observable({
		queryResultDataSource:dataSource,
		editItem:function (e){
			var index = e.target.parent().index();
		},
		deleteItem: function(e){
			var index = e.target.parent().index();
		}
	});
	kendo.bind($("#listview"), listViewModel);
	
}
