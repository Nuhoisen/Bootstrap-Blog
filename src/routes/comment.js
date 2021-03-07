// Formal Requires
const express 			= require('express')
const router 			= express.Router()

// User Requires
const Comment 	= require('./../models/comment')


if (process.env.NODE_ENV !== 'production'){
	Comment.find({})
		.then( async comments => {
			comments.forEach( async (comment)=>{
				console.log(comment)
			})
		})
}


// User must be signed in to comment
function checkAuthenticatedUser(req, res, next){
	req.session.returnTo =`/blog_post/${req.params.id}`;
	if (req.isAuthenticated()){
			return next();
	}
	// Redirect use to login, in order post.
	res.redirect('/signin');
}


// Comment submission
router.post('/:id', checkAuthenticatedUser, async (req, res, next) => {

    console.log("Adding comment")
    console.log("For Blog Post ID:" + req.params.id)
    console.log(req.body)

	console.log("User")
	console.log(req.user)
	let comment = new Comment({
        posterId:       req.user.id,
		posterUserName:	req.user.user_name,
        assocBlogPostId:req.params.id,
		body:		    req.body.markdown,
	})
	
  try{
	comment = await comment.save();
    // Redirect back to original post, now with updated comment
	res.redirect(`/blog_post/${req.params.id}`);

  }
  catch(e){
		console.log(e);
	  	res.redirect('/');
  }
})


// Blog post deletion
router.delete('/:id', async(req, res) => {
	postId = null 
	await Comment.findById(req.params.id, (err,comment)=>{
		if (err)
			console.log(err)
		else{
			postId = comment.assocBlogPostId;
		}
		
	})

	await Comment.findByIdAndDelete(req.params.id);
	res.redirect(`/blog_post/${postId}`);	
})



module.exports = router