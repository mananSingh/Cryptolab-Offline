function greet(){
	var today = new Date();
	var curHr = today.getHours();
	if(curHr>=4 && curHr <=12){
	      return "Good morning.";
	}else if(curHr>12 && curHr<=18){
	      return "Good afternoon.";
	}else{
	      return "Good evening.";
	}
}

$(document).ready(function(){
	$("#greet").text(greet());

	$("textarea").bind('paste', function(e) {
	        var ctl = $(this);
	        setTimeout(function() {
	            //Do whatever you want to $(ctl) here....
				$(ctl).trigger('autoresize');
	        }, 100);
	});
});

