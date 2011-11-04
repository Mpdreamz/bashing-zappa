@include = ->

	#include host server io event handlers
	@include "player/player.io.coffee"

	@get "/play/:name" : ->
		@render "/player/player.html", 
			foo: "bar", 
			name: @params.name,
			title: "Gamepje"

		#@render gameplay: { name: @params.name }

	@client "/play/js/socket.js" : ->
		@on connect: ->
			@emit play: { name: GameHost.name }
		@on host_joined: ->
			console.log "host_created: " + @data.name
		@on client_message: ->
			alert @data.text
		@connect();
		$ =>
			$("#sub").bind("click action", => @emit client_send: { text: $("#text").val() } )