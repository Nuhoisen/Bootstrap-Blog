const mongoose          = require('mongoose')
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const marked            = require('marked')
const slugify           = require('slugify')
const createDomPurify   = require('dompurify')
const { JSDOM }         = require('jsdom')
const dompurify         = createDomPurify(new JSDOM().window)


const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  },
  
  blogImages: {
	  type: [String]
  },
  
   blogImageTypes: {
	  type: [String]
  },
  
  category: {
	type: String,
	required: true
  }
  
})


blogPostSchema.virtual('blogImagePath').get(function(){
	if( this.blogImage != null && this.blogImageType != null ){
		return `data:${this.blogImageType};charset=utf-8;base64,${this.blogImage.toString('base64')}`
	}
})

blogPostSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }

  next()
})



// Pagination plugin
blogPostSchema.plugin(aggregatePaginate);


module.exports = mongoose.model('Blogpost', blogPostSchema);