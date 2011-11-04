@include = ->

	#include host server io event handlers
	@include "host/host.io.coffee"

	@get "/host/:name" : ->
		@redis_client().zrank "bashing::hosts", @params.name, (err, count) =>
			console.log "/host/game hit " + count
			console.log err if err
			if count == null
				@render "/host/host.html",
					layout: false,
					title: "Gamepje",
					name: @params.name,
					scripts: ["/host/js/socket.js"]
			else @redirect "/error/host_in_use/" + @params.name

	@post "/game/create" : ->
		@redirect "/host/" + @body.name
	
	@post "/game/play" : ->
		@redirect "/play/" + @body.name

	@client "/host/js/socket.js" : ->
		@on connect: ->
			@emit host: { name: GameHost.name, host: true }
		@on join: ->
			game.handleInput 'join', @data
		@on move: ->
			game.handleInput 'move', @data
		@connect();

