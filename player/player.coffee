@include = ->

	#include host server io event handlers
	@include "player/player.io.coffee"

	@get "/play/:name" : ->
		@render "/player/player.html", 
			layout: false, 
			name: @params.name,
			title: "Gamepje"

	@client "/play/js/socket.js" : ->
		window.emitter = this;
		@on connect: ->
			@emit play: { name: GameHost.name }
		@on host_died: ->
			window.location =  "/error/host_died/" + GameHost.name
		@on host_not_found: ->
			window.location =  "/error/host_not_found/" + GameHost.name
		@connect();
		#$ =>
		#	#FIXME bind werkt niet goed op Android
		#	$("#gamepad").bind "move", (e, data) =>
		#		$('#debug').html('aap');
		#		console.log(this);
		#		@emit move: data
		#	#$("#sub").bind("click action", => @emit client_send: { text: $("#text").val() } )

