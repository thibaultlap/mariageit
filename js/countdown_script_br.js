(function($){
	
	var note_br = $('#note_br'),
	
	ts = (new Date(2015,6,18,15,0,0));
		
	$('#countdown').countdown({
		timestamp	: ts,
		callback	: function(days, hours, minutes, seconds){
			
			var message = "";
			
			message += days + " dia" + ( days==1 ? '':'s' ) + ", ";
			message += hours + " hora" + ( hours==1 ? '':'s' ) + ", ";
			message += minutes + " minuto" + ( minutes==1 ? '':'s' + " et " );
			message += seconds + " segundo" + ( seconds==1 ? '':'s' );			note_br.html(message);
		}
	});
	
}(jQuery));
