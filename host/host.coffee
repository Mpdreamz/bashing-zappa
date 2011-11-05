@include = ->

	#include host server io event handlers
	@include "host/host.io.coffee"

	@get "/host/:name" : ->
		redis_client = @redis_client()
		name = @params.name
		redis_client.zrank "bashing::hosts", name, (err, count) =>
			console.log err if err
			return redis_client.quit() and @redirect("/error/host_in_use/" + name) if count != null
			redis_client.zadd "bashing::hosts", 0, name, (err) =>
				return redis_client.quit() and @redirect("/error/general_error/" + name) if err
				@render "/host/host.html",
					layout: false,
					title: "Gamepje",
					name: name,
					scripts: ["/host/js/socket.js"]

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
		@on respawn: ->
			game.handleInput 'respawn', @data
		@connect();

