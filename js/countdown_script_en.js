(function($){
	
	var note_en = $('#note_en'),
	
	ts = (new Date(2015,6,18,15,0,0));
		
	$('#countdown').countdown({
		timestamp	: ts,
		callback	: function(days, hours, minutes, seconds){
			
			var message = "";
			
			message += days + " day" + ( days==1 ? '':'s' ) + ", ";
			message += hours + " hour" + ( hours==1 ? '':'s' ) + ", ";
			message += minutes + " minute" + ( minutes==1 ? '':'s' + " and " );
			message += seconds + " second" + ( seconds==1 ? '':'s' );			note_en.html(message);
		}
	});
	
}(jQuery));
