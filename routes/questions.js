var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var histogram = require('./histogram')

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
					if ( doc.type == 2 ) {
						var all_votes = doc.votes;
						var stats = [0,0];
						for ( var i = 0 ; i < all_votes.length ; i++ ) {
							stats[ all_votes[i] ]++;
						}
						res.send( stats );
					} else if ( doc.type == 1 ) {
						var all_votes = doc.votes;
						// Get min & max to determine the bins
						var bound = [0,0];
						bound[0] = Math.min.apply(Math, all_votes);
						bound[1] = Math.max.apply(Math, all_votes);
						var gap = Math.round( (bound[1] - bound[0])/10 );
						
						var range = [];
						for ( var i = bound[0] ; i <= bound[1] + gap ; i+= gap ) {
							range.push(i);
						}
						
						console.log( all_votes );
						var stats = histogram({
							data : all_votes,
							i : doc.num_votes,
							bins : range
						});
						
						var count = []
						for(var i = 0; i < stats.length; i ++){
							count.push( stats[i].y );
						}
						res.send( { xval : range , yval : count } );
					}
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
