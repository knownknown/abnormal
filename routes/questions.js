var express = require('express');
var router = express.Router();

// Get question listing
router.get('/', function(req, res) {
    var db = req.db;
    db.collection('qlist').find().toArray(function (err, items) {
        res.render('questions', {
            "qlist" : items
        });
    });	
});

router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('qlist').find().toArray(function (err, items) {
        res.json(items);
    });
});

// Add question
router.post('/', function(req,res) {
    var db = req.db;
	var qText = req.body.text
	var qType = req.body.type
	
	db.collection('qlist').insert({
		"text" : qText,
		"type" : qType,
		answers : 0
	} , function(err,doc) {
		if ( err ) {
			res.send("There was a problem adding the question")
		} else {
			res.location("/questions")
			res.redirect("/questions")
		}
	});
});

module.exports = router;
