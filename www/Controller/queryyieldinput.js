function viewInit() {
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

function viewShow() {
	var dataSource = kendo.data.DataSource.create({
		data: [{
			recid: "222",
			itemInfo: "123",
			duty: "班别甲",
			date: "2015-12-02",
			flowcode: "222",
			devcode: "333",
			yield: "666",
			varieties: "品种一"
		}, {
			recid: "222",
			itemInfo: "123",
			duty: "班别甲",
			date: "2015-12-02",
			flowcode: "222",
			devcode: "333",
			yield: "666",
		}, {
			recid: "222",
			itemInfo: "123",
			duty: "班别甲",
			date: "2015-12-02",
			flowcode: "222",
			devcode: "333",
			yield: "666",
			varieties: "品种一"
		}],
	});
	var listViewModel = new kendo.observable({
		queryResultDataSource: dataSource,
		editItem: function(e) {
			
			var index = e.target.parent().index();
			var duty = e.target.parent().find("#duty").val();
			var varieties = e.target.parent().find("#varieties").val();
			var yield = e.target.parent().find("#yield").val();
			
		},
		deleteItem: function(e) {
			var index = e.target.parent().index();
		}
	});
	kendo.bind($("#listview"), listViewModel);

}