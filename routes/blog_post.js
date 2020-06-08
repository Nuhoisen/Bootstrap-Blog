// Formal Requires
const express 			= require('express')
const router 			= express.Router()
const marked 			= require('marked')
const multer 			= require('multer')


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
		cb(null, './static/imgs');
	},
	filename: function(req, file, cb) {
		// console.log(file)
		console.log(req.body)
		cb(null, file.originalname )  ;
	}
});
const upload 			= multer({
									storage: storage,
									fileFilter: fileFilter
								})
// -----------------------------------

// User Requires
const Blogpost 	= require('./../models/blog_post')



// Util functions
const utils			= require('../utils/utils')

// User defined types
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];


// Blog post get,
// Brings user to create page
// Requires authentication
router.get('/create', checkAuthenticatedAdmin, async (req, res, next) => {
	
	var user = req.user  ? req.user : null;
	res.render('blog_create_page', {user: user, blog_post: new Blogpost() });
});


function checkAuthenticatedAdmin(req, res, next){
	req.session.returnTo = req.originalUrl;
	if (req.isAuthenticated()){
		if(req.user.is_admin){
			return next();
		}
		// If user is not admin. Redirect them 
		// to home
		else {
			return res.redirect('/');
		}
	}
	// Redirect use to login, in order post.
	res.redirect('/signin');
}

// Filepond image formatting
function saveBlogImage(blogPost, blogImageEncoded){
	if(blogImageEncoded == null) return ;
	const blogImage = JSON.parse(blogImageEncoded);
	
	if(blogImage != null && imageMimeTypes.includes(blogImage.type)){
		blogPost.blogImage = new Buffer.from(blogImage.data, 'base64');
		blogPost.blogImageType = blogImage.type;
	}
}

// Blog post submission
router.post('/', upload.array('image', 10),  async (req, res, next) => {
  console.log(req.files);
  
  
  let blog_post = new Blogpost({
	  title: 		req.body.title,
	  summary:		req.body.summary,
	  markdown:		req.body.markdown,
	  category:		req.body.category
  })
  req.files.forEach( ( file ) => {
	  blog_post.blogImages.push( "/" + file.path.replace(/\\/g, "/") );
	  blog_post.blogImageTypes.push( file.mimetype );
  });
	  // blogImage:	"/" + req.file.path.replace(/\\/g, "/"),
  // saveBlogImage(blog_post, req.body.image);
  console.log(blog_post.blogImage);
  try{
	blog_post = await blog_post.save();
	res.redirect(`/blog_post/${blog_post.id}`);
  }
  catch(e){
		console.log(e);
	  res.redirect('/');
  }
})


// Blog post edit submission
router.put('/:id', upload.array('image', 10),  async ( req, res, next ) => {
	console.log(req.body)
	let blog_posting ;
	try{
		blog_posting  = await Blogpost.findById(req.params.id);
		// Update modifiable fields
		blog_posting.title  	= req.body.title;
		blog_posting.summary	= req.body.summary,
		blog_posting.markdown 	= req.body.markdown,
		blog_posting.category 	= req.body.category
		
		console.log("Testing req file existence" )
		console.log( req.file )
		
		if( req.file ) {
			blog_posting.blogImage 		= "/" + req.file.path.replace(/\\/g, "/");
			blog_posting.blogImageType 	= req.file.mimetype;	
		}
		console.log(blog_posting);
		blog_posting = await blog_posting.save();
		res.redirect(`/blog_post/${blog_posting.id}`);
	}
    catch(e){
		console.log(e);
		if(blog_posting == null){
			res.redirect('/');
		}
		else{
			console.log(blog_posting);
			var user = req.user  ? req.user : null;
			res.render('blog_edit_page', {user: user, blog_post: blog_posting});
		}
	}
	
})



// Blog post retrieval
router.get('/:id', async (req, res) => {
  // Query Database for ID.
  // If it's found, load the blogpost.
  // Otherwise, redirect home.
  Blogpost.findById(req.params.id)
	.then( blog_posting =>{
		var user = req.user  ? req.user : null;	
		res.render('blog_post_template', {blog_post: blog_posting, user: user});
	})
	.catch( e => {
		res.redirect('/');
	});
});


// Blog post deletion
router.delete('/:id', async(req, res) => {
	console.log("Deleteing post")
	await Blogpost.findByIdAndDelete(req.params.id);
	res.redirect('/');	
})




// Blog post edit
router.get('/edit/:id',  async(req, res) => {
	console.log("In edit call");
	Blogpost.findById(req.params.id)
		.then( blog_posting => {
			var user = req.user  ? req.user : null;
			res.render('blog_edit_page', {user: user, blog_post: blog_posting});
		})
		.catch (e => {
			res.redirect('/');
		})
})


module.exports = router