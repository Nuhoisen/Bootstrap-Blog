// Formal Requires
const multer = require('multer')
const sgMail = require('@sendgrid/mail');

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = function(mailOptions){
    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        });
    });
}

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




// ------------ Multer ---------------
const fileFilter = ( req, file, cb) => {
	if (imageMimeTypes.includes(file.mimetype)){
		cb( null, true);
	}
	else {
		console.log("Invalid file type upload")
		cb( null, false);
	}	
}
const storage			= multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './src/static/imgs');
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname )  ;
	}
});
const upload 			= multer({
									storage: storage,
									fileFilter: fileFilter
								})
// -----------------------------------


exports.storage			= storage;
exports.upload			= upload;
exports.fileFilter		= fileFilter;

exports.formatArchives 	= formatArchives;
exports.pullDate		= pullDate;
exports.sendEmail		= sendEmail;
exports.imageMimeTypes	= imageMimeTypes;