var mouseDown = false;
var dpad = document.getElementById('gamepad');


function sendMove(x,y) {
	$('#gamepad').trigger('move', { x: x, y: y });
}

function handleEvent(e) {
	e.preventDefault();
	var offset = $(dpad).offset();
	var size = $(dpad).width();
	var x, y;
	if(e.touches) {
		x = e.touches[0].pageX - offset.left;
		y = e.touches[0].pageY - offset.top;
	} else {
		x = e.pageX - offset.left;
		y = e.pageY - offset.top;
	}
	x -= 95; 
	y -= 95;
	
	sendMove(x,y);
	moveButton(x,y);
}

function init() {
	if(typeof(document.ontouchmove) != 'undefined') {
		// Doesn't seem to work when using JQuery bind:
		dpad.addEventListener('touchstart', handleEvent, false);
		dpad.addEventListener('touchmove', handleEvent, false);
	} else {
		$(dpad).bind('mousedown', function(e) {
			mouseDown = true;
			handleEvent(e);
		});
		$(dpad).bind('mousemove', function(e) {
			if(mouseDown) handleEvent(e);
		});
		$(dpad).bind('mouseup', function(e) {
			mouseDown = false;
		});
	}
}

function moveButton(x, y) {
     $('#gamepad-button').css({ left: Math.min(50 + x, 110), top: Math.min(50 + y, 110) });
}

init();
