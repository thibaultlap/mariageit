(function($){
	
	var note = $('#note'),
	
	ts = (new Date(2015,6,18,15,0,0));
		
	$('#countdown').countdown({
		timestamp	: ts,
		callback	: function(days, hours, minutes, seconds){
			
			var message = "";
			
			message += days + " jour" + ( days==1 ? '':'s' ) + ", ";
			message += hours + " heure" + ( hours==1 ? '':'s' ) + ", ";
			message += minutes + " minute" + ( minutes==1 ? '':'s' + " et " );
			message += seconds + " seconde" + ( seconds==1 ? '':'s' );			note.html(message);
		}
	});
	
}(jQuery));
