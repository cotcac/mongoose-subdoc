const mongoose = require('mongoose');
const shortid = require('shortid');
var blogSchema = mongoose.Schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    title: { type: String, required: true },
    content: String,
    images: [
        {
            url: { type: String },
            images:{type: Boolean, default:true},
            date: { type: Date, default: Date.now }
        }
    ],
    date: { type: Date, default: Date.now }
}, { collection: 'blog' }); // avoid auto create modle. that's fuck.
const blogsModel = module.exports = mongoose.model('blog', blogSchema);

// find one
module.exports.findOneWhere = function (data, callback) {
    blogsModel.aggregate([
       {$match:data},
        {$unwind: "$images"},
        {$sort:{"images.images":-1,"images.date":-1}},
        {$group:{
            "_id":"$_id",
            "images":{
                $push:"$images"
            }
        }}
    ], callback);
}
