/*
 * Gamepad
 */
function Gamepad() {

    //constants
    this.maxDistance = 60;
    this.normalizedScale = 150;

    this.x = 0;
    this.y = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.gamepad = $('#gamepad');
    this.centerX = this.gamepad.offset().left + Math.round(this.gamepad.width() / 2);
    this.centerY = this.gamepad.offset().top + Math.round(this.gamepad.height() / 2);

    this.button = $('#gamepad-button');
    this.buttonCenterX = this.centerX - Math.round($(this.button).width() / 2);
    this.buttonCenterY = this.centerY - Math.round($(this.button).height() / 2);

    this.engine = $('#engine');

    var _instance = this; // Yikes
    document.getElementById('gamepad-container').addEventListener('mousemove', function(e) {
    	_instance.onMove(e);
    }, false);
    document.getElementById('gamepad-container').addEventListener('touchstart', function(e) {
    	_instance.onTouchStart(e);
    }, false);
    document.getElementById('gamepad-container').addEventListener('touchmove', function(e) {
    	_instance.onMove(e);
    }, false);
    document.getElementById('gamepad-container').addEventListener('touchend', function(e) {
    	_instance.onTouchEnd(e);
    }, false);

	document.getElementById('action-button').addEventListener('click', function(e) {
		gamepad.sendRespawn();
	});
	
	document.addEventListener('load', function() {
		window.scrollTo(0,1);
	}, false);

	document.addEventListener('touchmove', function(e) {
		e.preventDefault()
	}, false);

	this.renderButton(this.x, this.y);
};

Gamepad.prototype.onTouchStart = function(e) {
    //var bodyelem = $('body');
    //bodyelem.scrollTop(25);
    e.preventDefault();
};

Gamepad.prototype.onTouchEnd = function(e) {
    e.preventDefault();
    this.sendMove(0, 0);
    this.renderButton(0, 0);
};

Gamepad.prototype.onMove = function(e) {
    e.preventDefault();
    var pageX, pageY;
	if(e.touches) {
		pageX = e.touches[0].pageX;
		pageY = e.touches[0].pageY;
	}
	else {
		pageX = e.pageX;
		pageY = e.pageY;
	}
	var x = pageX - this.centerX;
	var y = pageY - this.centerY;
	var distance = this.getDistance(0, 0, x, y);

    // maximum movement
    if (distance > this.maxDistance) {
		var dPow = this.maxDistance / distance;
		x = Math.round(x * dPow);
		y = Math.round(y * dPow);
    }
    
	this.sendMove(this.normalize(x), this.normalize(y));
	this.renderButton(x, y);
};

Gamepad.prototype.normalize = function(num){
    return Math.round(num * (this.normalizedScale / this.maxDistance));
};

Gamepad.prototype.getDistance = function(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
};

Gamepad.prototype.renderButton = function(x, y) {
    var buttonX = x + this.buttonCenterX;
    var buttonY = y + this.buttonCenterY;
    this.button.css({left: buttonX + 'px', top: buttonY + 'px'});
};

Gamepad.prototype.sendMove = function(x, y) {
    emitter.emit('move', { x: x, y: y });
};
Gamepad.prototype.sendRespawn = function() {
    emitter.emit('respawn', {});
};


var gamepad = new Gamepad();

