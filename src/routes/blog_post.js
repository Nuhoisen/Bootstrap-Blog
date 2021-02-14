// Formal Requires
const express 			= require('express')
const router 			= express.Router()
const marked 			= require('marked')




// User Requires
const Blogpost 	= require('./../models/blog_post')
const Subscriber 	= require('./../models/subscribe')
const {sendEmail,upload} 	= require('../utils/utils')

// Util functions
const utils			= require('../utils/utils')

// User defined types
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];



// if (process.env.NODE_ENV !== 'production'){
// Subscriber.find({})
// 		.then( async subscribers => {
// 			subscribers.forEach( async (sub)=>{
// 				console.log(sub)
// 			})
// 		})
// }


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
  
	let blog_post = new Blogpost({
		title: 			req.body.title,
		summary:		req.body.summary,
		markdown:		req.body.markdown,
		category:		req.body.category
	})
	// Store all passed images into the data base
	req.files.forEach( ( file ) => {
		blog_post.blogImages.push( "/" + file.path.replace(/\\/g, "/") );
		blog_post.blogImageTypes.push( file.mimetype );
	});



  try{
	blog_post = await blog_post.save();
	res.redirect(`/blog_post/${blog_post.id}`);


	// Notify Subscribers
	await Subscriber.find({})
		.then( async subscribers => {
			subscribers.forEach( async (sub)=>{
				await notifySubsribers(sub, blog_post, req, res);
			})
		})
		.catch( async e => {
			return null;
		});


  }
  catch(e){
		console.log(e);
	  res.redirect('/');
  }
})

// Blog post edit submission
router.put('/:id', upload.array('image', 10),  async ( req, res, next ) => {
	let blog_posting ;
	try{
		blog_posting  = await Blogpost.findById(req.params.id);
		// Update modifiable fields
		blog_posting.title  	= req.body.title;
		blog_posting.summary	= req.body.summary;
		blog_posting.markdown 	= req.body.markdown;
		blog_posting.category 	= req.body.category;
		// Store all passed images into the data base
		req.files.forEach( ( file ) => {
			  blog_posting.blogImages.push( "/" + file.path.replace(/\\/g, "/") );
			  blog_posting.blogImageTypes.push( file.mimetype );
		});
		
		blog_posting = await blog_posting.save();
		res.redirect(`/blog_post/${blog_posting.id}`);
	}
    catch(e){
		console.log(e);
		if(blog_posting == null){
			res.redirect('/');
		}
		else{
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
	await Blogpost.findByIdAndDelete(req.params.id);
	res.redirect('/');	
})




// Blog post edit
router.get('/edit/:id',  async(req, res) => {
	
	Blogpost.findById(req.params.id)
		.then( blog_posting => {
			var user = req.user  ? req.user : null;
			res.render('blog_edit_page', {user: user, blog_post: blog_posting});
		})
		.catch (e => {
			res.redirect('/');
		})
})



// Used to send email to verified user
async function notifySubsribers(subscriber, blog_post ,req, res){
    try{
        let subject = "Latest Post: " + blog_post.title + "!";
        let to = subscriber.email;
        let from = process.env.FROM_EMAIL;
        let link="http://"+req.headers.host+`/blog_post/${blog_post.id}`;
		let homepage="http://"+req.headers.host;
		subscriber.first_name = (subscriber.first_name) ? subscriber.first_name : "New Blogger";
        let html = `<p>Hi ${subscriber.first_name}!<p><p>Check out my latest blog post <a href="${link}">here!</a></p>
                    This and many other can be found at <a href="${homepage}">${homepage}</a>!</p>
					<br><p>Thanks!</p>
                  <br><p>If you did not request this, please ignore this email.</p>`;

        console.log("Sending Email");
	    await sendEmail({to, from, subject, html});
	    console.log("Successfully sent email");	
    }catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = router