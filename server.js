
if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}
// Formal Requires
const express 			= require('express')
const mongoose			= require('mongoose')
const flash				= require('express-flash')
const session			= require('express-session')
const passport			= require('passport')
const methodOverride 	= require('method-override')


// Models
const Blogpost 		= require('./src/models/blog_post')

// Utils
const utils			= require('./src/utils/utils')
const s3			= require('./src/utils/s3')

// DB Setup
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

// Express Setup
const app = express()
const port = 8080 

// User Meta Data
app.locals.metaData 	= require('./src/static/blog_content/blog_data')
s3.getImage('profile.jpg').then(img=>{app.locals.metaData.profile_img=s3.encode(img.Body)}).catch(e=>{console.log(e)});
app.locals.pageIndex	= 0


// App Setup
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(flash());
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave:	false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Static files
app.use(express.static(__dirname + "/src/static/css"))
app.use(express.static(__dirname + "/src/static/js"))
app.use(express.static(__dirname + "/src/static/blog"))
app.use("/src/static/imgs", express.static(__dirname + "/src/static/imgs"))



// View Engine Setup
app.set('views', [	__dirname+'/src/views/blog_template', 
					__dirname+'/src/views/homepage_template',
					__dirname+'/src/views/metahead_template',
					__dirname+'/src/views/shared_templates',
					__dirname+'/src/views/signin_template',
					__dirname+'/src/views/signup_template',
					__dirname+'/src/views/comments_template',
					__dirname+'/src/views/subscribe_template'])
app.set('view engine', 'ejs')

// ---- Cache information -----
Blogpost.find({}).sort({createdAt: 'desc'}).exec()
	.then( function(dbContents) {		
		app.locals.archivedMonths = utils.formatArchives(dbContents);
	})
	.catch( function(err){
		return console.error(err);
	});




// ---- Shutdown - Process Kill -----
// Shut Down the data base cleanly
process.on('SIGINT', function() {
	console.log("SIGINT detected. Closing Mongoose")
	mongoose.disconnect();	
 });
 
mongoose.connection.on("close", function(err,conn){
	console.log("Exit Called. Mongoose disconnected")
	process.exit();
});

// ---- CONFIGURE ROUTES ----
// Configure Route
require('./src/routes/index')(app);

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
