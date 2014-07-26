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
	var answer_bin = false;
	if ( val == "Yes" ) {
		answer = 1;
		answer_bin = true;
	} else if ( val == "No." ) {
		answer = 0;
		answer_bin = true;
	} else if ( vall ="Submit") {
		answer = parseInt( $(this).serializeArray()[0].value );
	}

    $.getJSON( '/questions/vote/' + id + '/' + answer , function( data ) {
		// Hide the response
		// $('form#' + id ).hide();
		// $('form#' + id ).html( data );

		if ( answer_bin ) {
			var dat_tbl = google.visualization.arrayToDataTable( data );

			var options = {
				'width':200,
				'height':200,
				'backgroundColor':'f6f6f6',
				pieHole: 0.4,
				'chartArea': {'width': '100%', 'height': '80%'},
				colors: ['#F67502','#87AD03'],
				legend: {position: 'none'}
			};

			var chart = new google.visualization.PieChart(document.getElementById('frame_' + id));
			chart.draw(dat_tbl, options);
			chart.setSelection([{row: answer}]);
		}
		
		// document.getElementById('box_' + id ).style.opacity = 0.5;
        // Populate the question
		nextQuestion( current_questions[ ++q_ctr ] );	
    });
});


function nextQuestion( q_object ) {
	var code = '';
	if ( q_object.type == 1 ){
		code = '<li class="clear_box" id="box_' + q_object._id + '">' + q_object.text + '<br /><br /><div id="frame_' + q_object._id + '"><form method="post" id="' + q_object._id + '"><input type="text" size="3" name="answer"><button type="submit">Submit</button></form></div></li>';		
	} else {
		code = '<li class="clear_box" id="box_' + q_object._id + '">' + q_object.text + '<br /><br /><div id="frame_' + q_object._id + '" class="chart_div"><form method="post" id="' + q_object._id + '"><button type="submit" name="Yes" class="yes">Yes</button><button type="submit" name="No" class="no">No.</button></form></div></li>';		
	}
	
	$( code ).prependTo("#questions").hide().slideDown();
}