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


$('#questions').on('submit', 'form', function(e) {
	e.preventDefault();

	// Figure out which button was pushed
	var val = $(this).find("button[type=submit]:focus")[0].textContent;
	var id = $(this).attr("id")
	var answer;
	if ( val == "Yes" ) {
		answer = '1';
	} else if ( val == "No." ) {
		answer = '0';
	} else if ( vall ="Submit") {
		answer = $(this).serializeArray()[0].value;
	}

    $.getJSON( '/questions/vote/' + id + '/' + answer , function( data ) {
		// Hide the response
		$('form#' + id ).hide();
        // Populate the question
		nextQuestion( current_questions[ ++q_ctr ] );	
    });
});


function nextQuestion( q_object ) {
	var code = '';
	if ( q_object.type == 1 ){
		code = '<li class="box" id="box_' + q_object._id + '">' + q_object.text + '<br /><br /><form method="post" id="' + q_object._id + '"><input type="text" size="3" name="answer"><button type="submit">Submit</button></form></li>';		
	} else {
		code = '<li class="box" id="box_' + q_object._id + '">' + q_object.text + '<br /><br /><form method="post" id="' + q_object._id + '"><button type="submit" name="Yes" class="yes">Yes</button><button type="submit" name="No" class="no">No.</button></form></li>';		
	}
	
	$( code ).prependTo("#questions").hide().slideDown();
}