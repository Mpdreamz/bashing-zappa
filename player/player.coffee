@include = ->

	#include host server io event handlers
	@include "player/player.io.coffee"

	@get "/play/:name" : ->
		@render "/player/player.html", 
			layout: false, 
			name: @params.name,
			title: "Gamepje"

	@client "/play/js/socket.js" : ->
		@on connect: ->
			@emit play: { name: GameHost.name }
		@connect();
		$ =>
			$("#gamepad").bind "touchmoved", (e, data) =>
				$("#button-container").append('x' + data.x + ',y' + data.y + '**>>');
				@emit move: data
			$("#sub").bind("click action", => @emit client_send: { text: $("#text").val() } )

