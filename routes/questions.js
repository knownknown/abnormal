var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

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

router.get('/delete/:id', function(req, res) {
    var db = req.db;
	db.collection('qlist').remove({_id: ObjectId(req.params.id) }, function(e, result){
		res.redirect( '/questions' );
	});
});

router.get('/vote/:id/:answer', function(req, res) {
    var db = req.db;
	var q_id = ObjectId(req.params.id);
	var q_answer = req.params.answer;	
	var update = {'$push': { 'votes':q_answer}, '$inc': {vote_count: 1}};

	db.collection('qlist').updateById( q_id , update, {safe:true, multi:false}, function(e, result){
		res.send((result===1)?{msg:'success'}:{msg:'error'})
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
		vote_count : 0,
		votes : []
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
