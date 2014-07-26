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
	var q_answer = parseInt( req.params.answer );	
	var update = {'$push': { 'votes':q_answer}, '$inc': {vote_count: 1}};

	db.collection('qlist').updateById( q_id , update, {safe:true, multi:false}, function(e, result){
		if ( result == 0 ) {
			res.send( { msg: "ERROR" } );
		} else {
			var ret = db.collection('qlist').findOne({_id:q_id},function(err, doc) {
				if (doc){
					var all_votes = doc.votes;
					var stats =
						[
						['Answer', 'Votes'],
						['No', 0],
						['Yes', 0],
						];
						
					for ( var i = 0 ; i < all_votes.length ; i++ ) {
						stats[ all_votes[i]+1 ][ 1 ]++;
					}
					res.send( stats );
				} else {
					res.send( { msg: "ERROR" } );
				}
			});
		}
	});
});

// Add question
router.post('/', function(req,res) {
    var db = req.db;
	var qText = req.body.text
	var qType = req.body.type
	
	db.collection('qlist').insert({
		"text" : qText,
		"type" : parseInt(qType),
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
