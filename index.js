var express = require('express');
var mongoose = require('mongoose');
const shortid = require('shortid');
const app = express();
mongoose.connect('mongodb://localhost/meanblog', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const objId = require('mongodb').ObjectID;

var blogModels = require('./db/mdl_blog');
app.post('/', function (req, res, next) {
    var blog = {
        "title": "this is the title",
        "content": "this is the content",
        "images": [
            { "url": "url 1" },
            { "url": "url 2" },
            { "url": "url 3" },
            { "url": "url 4" }
        ]
    }
    blogModels.create(blog);
    res.send(blog);
});
// get 1 id

app.get('/:id', (req, res) => {
    const id = req.params.id;
    blogModels.findOneWhere({ _id: id }, (err, doc) => {
        if (err) throw err;
        res.json(doc);
    })
})
// add new images
app.patch('/:id', (req, res) => {
    const id = req.params.id;
    const url = "img 6"
    blogModels.updateOne({ _id: id }, { $addToSet: { images: { url: url, images:false } } }, (err, doc) => {
        if (err) res.status(500).json(err);
        res.status(200).json(doc);
    })
})
// top up images.
app.patch('/images/:id', (req, res) => {
    const id = req.params.id;
    const image_id = "5d9dbc9f6fc74a7f82b71d1a";
    let where = {
        _id: id,
        'images._id': objId(image_id)
    };
    let set = {
        $set: {
            "images.$": {date:+new Date(), url:"url 7"}
        }
    };
    blogModels.updateOne(where, set, (err, doc) => {
        if (err) res.status(500).json(err);
        res.status(200).json(doc);
    })
})

app.get('/', (req, res) => {
    blogModels.find({}, (err, doc) => {
        if (err) throw err;
        res.json(doc);
    })
})
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
