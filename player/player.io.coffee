@include = ->

	@on play: ->
		redis_client = @redis_client();
		@socket.set("host", @data.name, => console.log "join for #{@data.name} received")
		redis_client.incr "bashing::player.serial", (err, id) =>
			console.log err if err
			@socket.set("playerId", id, => console.log "player #{id} saved")
			@socket.join(@data.name)
			@io.sockets.in(@data.name + ".host").emit "join", { id: id }
	
	@on move: ->
		@socket.get "host", (err, host) =>
			@socket.get "playerId", (err, id) =>
				@io.sockets.in(host + ".host").emit "move", { x: @data.x, y: @data.y, player: id }

