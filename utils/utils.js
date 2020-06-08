const pullDate = function( month, year , day){
	var monthLookup = {
		"january":  0,
		"february": 1,
		"march" : 	2,
		"april" : 	3,
		"may" 	: 	4,
		"june"	: 	5,
		"july"	: 	6,
		"august": 	7,
		"september":8,
		"october": 	9,
		"november": 10,
		"december": 11
	}

	var monthIndex = monthLookup[month];
	
	return new Date ( year , monthIndex, day);

}
const formatArchives = function(dbContents){
		var archivedMonths = new Array();
		var month = new Array();
			month[0] = "January";
			month[1] = "February";
			month[2] = "March";
			month[3] = "April";
			month[4] = "May";
			month[5] = "June";
			month[6] = "July";
			month[7] = "August";
			month[8] = "September";
			month[9] = "October";
			month[10] = "November";
			month[11] = "December";
			
		dbContents.forEach(element => {
			var dt = new Date( element.createdAt);
			if (!archivedMonths.includes(`${month[dt.getMonth()]} ${dt.getFullYear()}`)) archivedMonths.push(`${month[dt.getMonth()]} ${dt.getFullYear()}`)
		})
		
		return archivedMonths;
}

exports.formatArchives 	= formatArchives;
exports.pullDate		= pullDate;