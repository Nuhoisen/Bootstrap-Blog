const AWS				= require('aws-sdk')

///////////////
// AWS Setup //
///////////////
const encode = function(data){
	let buf = Buffer.from(data);
	let base64	= buf.toString('base64');
	return base64;
}

AWS.config.update({
	accessKeyId: process.env.AWSAccessKeyId,
	secretAccessKey: process.env.AWSSecretKey
  });

let s3 = new AWS.S3();

const getImage = function(image_name){
	const data = s3.getObject({
		Bucket: process.env.AWSBucketStorageName,
		Key:	image_name
	}).promise();
	return data;
}


const upload = async function(file){
    const data = s3.upload({
        Bucket: process.env.AWSBucketStorageName,
        Key: file.originalname,
        Body: file.buffer,
        ContentLength: file.size,
        ContentType: file.mimetype
    }).promise();
}


exports.getImage = getImage;
exports.encode  = encode;
exports.upload  = upload;
///////////////