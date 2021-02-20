
///////// Formal Requires /////////////
const methodOverride 	= require('method-override')

///////// Local Requires /////////////

// Routes
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const blogpostRouter = require('./blog_post')
const subscribeRouter= require('./subscribe')

// Models
const Blogpost = require('./../models/blog_post')

// Utils
// Util functions
const {pullDate}			            = require('./../utils/utils')
const {getImage,encode}	        = require('./../utils/s3')

const RESULTS_PER_PAGE = 4



module.exports = app => {
    

    // Root call. 
    // Query the DB and update blog w/results
    app.get('/', (req,res)=>{
	
        var aggregateQuery = Blogpost.aggregate();
            
        Blogpost.aggregatePaginate(	
            aggregateQuery, 
            { page: 1, limit: RESULTS_PER_PAGE, sort: { createdAt: 'desc' }},
            async function( err, dbContents) {
                if (err) return console.error(err);
                
                ///////////////// EDIT  THIS /////////////////////
                var promises= [];
                // Fetch all the images names from the s3 bucket and add their contents to object
                dbContents.docs.forEach( posting => {
                    // There are images
                    if (posting.blogImages.length > 0){
                        // Create an array to hold bytes
                        posting.blogImageContents = [];
                        posting.blogImages.forEach( image_name => {
                            // Call s3 method
                            var promise = getImage(image_name)
                                .then((img)=>{ posting.blogImageContents.push(encode(img.Body)) }).catch( e => {console.log(e); })
                            // Push promise onto stack for later resolution
                            promises.push(promise);
                        })
                    }
                });

                // Later Resolution
                await Promise.all(promises);
                var user = req.user  ? req.user : null;									
                res.render('index', { user: user, blogContent : dbContents }); // Pass the DB Results into the Renderer
        });
    });

    // Category call.
    // Return results falling under category
    app.get('/category/:category', (req, res)=>{
            
        var aggregateQuery = Blogpost.aggregate([ { $match:{category: req.params.category} } ]);
        Blogpost.aggregatePaginate(	
            aggregateQuery, 
            { page: 1 , limit: RESULTS_PER_PAGE, sort: { createdAt: 'desc' }},
            function( err, dbContents) {
            if (err) return console.error(err); 
            var user = req.user  ? req.user : null;
            res.render('index', { user: user, blogContent : dbContents }); // Pass the DB Results into the Renderer
        });
    });

    // Date call.
    // Return results in specified month and year
    app.get('/date/:date', (req, res)=>{
        var start = pullDate(req.params.date.split('-')[0], req.params.date.split('-')[1], 1);
        var end = new Date( start.getFullYear(), start.getMonth(), 31, 23, 59);
        
        var aggregateQuery = Blogpost.aggregate([ { $match:{"createdAt": {"$gte": start, "$lt": end} } } ]);
        
        Blogpost.aggregatePaginate(	
            aggregateQuery, 
            { page: 1, limit: RESULTS_PER_PAGE, sort: { createdAt: 'desc' }},
            function( err, dbContents) {
            if (err) return console.error(err);
            var user = req.user  ? req.user : null;
            res.render('index', { user: user, blogContent : dbContents }); // Pass the DB Results into the Renderer
        });
    });

    // When User refreshes for older results
    app.get('/nav/:page_num', (req, res) => {
        
            
        var aggregateQuery = Blogpost.aggregate();
            
        Blogpost.aggregatePaginate(	
            aggregateQuery, 
            { page: req.params.page_num, limit: RESULTS_PER_PAGE, sort: { createdAt: 'desc' }},
            function( err, dbContents) {
            if (err) return console.error(err);

            var user = req.user  ? req.user : null;
            res.render('index', { user: user, blogContent : dbContents }); // Pass the DB Results into the Renderer
        });
    });


    // Signout method
    // Override POST method in form
    // To delete the session meta information
    app.delete('/signout', (req, res) => {
        req.logOut();
        res.redirect('/');
    })


    //Blog post router. Handles post requests
    app.use('/signin'	, signinRouter)
    app.use('/signup'	, signupRouter)
    app.use('/blog_post', blogpostRouter)
    app.use('/subscribe', subscribeRouter)


    // app.use('/api/auth', auth);
    // app.use('/api/user', authenticate, user);
};
