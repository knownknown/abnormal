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
	var answer_bin;
	if ( val == "Yes" ) {
		answer = 1;
		answer_bin = true;
	} else if ( val == "No." ) {
		answer = 0;
		answer_bin = true;
	} else if ( vall ="Submit") {
		answer = parseInt( $(this).serializeArray()[0].value );
		answer_bin = false;
	}

    $.getJSON( '/questions/vote/' + id + '/' + answer , function( data ) {
		$('form#' + id ).hide();
		$('#frame_' + id ).show();
		if ( answer_bin ) {
			var pieData = [
				{ label : "No" , value : data[0], color:"#F67502" },
				{ label : "Yes" , value : data[1], color:"#87AD03" }
			];
			var pieOptions = {
				animationEasing: "easeOutSine",
				animationSteps : 75,
				segmentShowStroke : true
			};
			var canvas = document.getElementById("frame_" + id).getContext("2d");
			new Chart(canvas).Doughnut(pieData, pieOptions);
		} else {
			var histData = {
				labels : data.xval,
				datasets : [{fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",data : data.yval }]
			};
			var histOptions = {
				pointDot : false,
				animationEasing: "easeOutSine"
			};			
			var canvas = document.getElementById("frame_" + id).getContext("2d");
			new Chart(canvas).Line(histData,histOptions);
		}
		
		if ( q_ctr < current_questions.length - 1 ) nextQuestion( current_questions[ ++q_ctr ] );	
    });
});


function nextQuestion( q_object ) {
	var code = '';
	if ( q_object.type == 1 ){
		code = '<li class="clear_box" id="box_' + q_object._id + '">' + q_object.text + '<br /><br /><canvas id="frame_' + q_object._id + '" class="chart_div" style="display:none" height=200 width=500></canvas><form method="post" id="' + q_object._id + '"><input type="text" size="3" name="answer" class="qmain"><br /><button type="submit" class="yes">Submit</button></form></li>';		
	} else {
		code = '<li class="clear_box" id="box_' + q_object._id + '">' + q_object.text + '<br /><br /><canvas id="frame_' + q_object._id + '" class="chart_div" style="display:none" height=150 width=150></canvas><form method="post" id="' + q_object._id + '"><button type="submit" name="Yes" class="yes">Yes</button><button type="submit" name="No" class="no">No.</button></div></li>';		
	}
	
	$( code ).prependTo("#questions").hide().slideDown();
}