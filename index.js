
if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}
// Formal Requires
const ejs				= require('ejs')
const express 			= require('express')
const path 				= require('path')
const mongoose			= require('mongoose')
const marked 			= require('marked')
const flash				= require('express-flash')
const session			= require('express-session')
const passport			= require('passport')
const methodOverride 	= require('method-override')
// Model Requires
const Blogpost 		= require('./models/blog_post')
const UserSignin 	= require('./models/signin')


// Route Requires
const signinRouter 	 = require('./routes/signin')
const signupRouter 	 = require('./routes/signup')
const blogpostRouter = require('./routes/blog_post')


// Util functions
const utils			= require('./utils/utils')

// DB Setup
mongoose.connect('mongodb://localhost/blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

// Express Setup
const app = express()
const port = 3000

// User Meta Data
app.locals.metaData 	= require('./static/blog_content/blog_data')


// App Setup
app.use(express.urlencoded({extended: false}));
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
app.use(express.static(__dirname + "/static/css"))
app.use(express.static(__dirname + "/static/js"))
app.use(express.static(__dirname + "/static/blog"))
app.use("/static/imgs", express.static(__dirname + "/static/imgs"))


// View Engine Setup
app.set('views', [	__dirname+'/views/blog_template', 
					__dirname+'/views/homepage_template',
					__dirname+'/views/metahead_template',
					__dirname+'/views/shared_templates',
					__dirname+'/views/signin_template',
					__dirname+'/views/signup_template'])
app.set('view engine', 'ejs')


//Blog post router. Handles post requests
app.use('/signin'	, signinRouter)
app.use('/signup'	, signupRouter)
app.use('/blog_post', blogpostRouter)

// Cache information
Blogpost.find({}).sort({createdAt: 'desc'}).exec()
	.then(function(dbContents) {			
		app.locals.archivedMonths = utils.formatArchives(dbContents);
	})
	.catch( function(err){
		return console.error(err);
	});





// Signout method
// Override POST method in form
// To delete the session meta information
app.delete('/signout', (req, res) => {
	req.logOut();
	res.redirect('/');
})




// Root call. 
// Query the DB and update blog w/results
app.get('/', (req,res)=>{
	
	Blogpost.find({}).sort({createdAt: 'desc'}).exec(function(err, dbContents) {
		if (err) return console.error(err);
			
		var user = req.user  ? req.user : null;
		app.locals.archivedMonths = app.locals.archivedMonths  ? app.locals.archivedMonths : utils.formatArchives(dbContents);
		
		res.render('index', { user: user, blogContent : dbContents }); // Pass the DB Results into the Renderer
	});
});



// Category call.
// Return results falling under category
app.get('/category/:category', (req, res)=>{
	Blogpost.find({ category: req.params.category }, function (err, dbContents) {
		if (err) return console.error(err);
		
		var user = req.user  ? req.user : null;
		res.render('index', {user: user, blogContent : dbContents}); // Pass the DB Results into the Renderer
	});
});


// Category call.
// Return results falling under category
app.get('/date/:date', (req, res)=>{
	
	var start = utils.pullDate(req.params.date.split('-')[0], req.params.date.split('-')[1], 1);
	var end = new Date( start.getMonth(), start.getFullYear(), 31);
	
	Blogpost.find({"createdAt": {"$gte": start, "$lt": end}}, function (err, dbContents) {
		if (err) return console.error(err);
		
		var user = req.user  ? req.user : null;
		
		res.render('index', {user: user, blogContent : dbContents}); // Pass the DB Results into the Renderer
	});
});



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
