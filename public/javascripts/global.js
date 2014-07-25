var current_questions = [];
var q_ctr = 0;

$(document).ready(function() {
	loadQuestions();
});

function loadQuestions() {
    // jQuery AJAX call for JSON
    $.getJSON( '/questions/list' , function( data ) {
        // Populate the question
		current_questions = data;
		nextQuestion( current_questions[ q_ctr ] );
    });
};

$('#questions').on('click', '#vote', function() {
	nextQuestion( current_questions[ ++q_ctr ] );
});

function nextQuestion( q_object ) {
	var code = '';
	if ( q_object.type == 1 ){
		code = '<li class="box">' + q_object.text + '<br /><br /><form method="post"><input type="text" size="3"><button type="button" id="vote">Vote!</button></form></li>';		
	} else {
		code = '<li class="box">' + q_object.text + '<br /><br /><form method="post"><button type="button" id="vote">Yes</button><button type="button" id="vote">No</button></form></li>';		
	}
	
	$( code ).prependTo("#questions").hide().slideDown();
}