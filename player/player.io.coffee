@include = ->

	@on play: ->
		redis_client = @redis_client();
		@socket.set("host", @data.name, => console.log "join for #{@data.name} received")
		@socket.set("type", "player")
		redis_client.multi([
			["incr", "bashing::player.serial"],
			["zincrby", "bashing::hosts", 1, @data.name]
		]).exec (err, replies) =>
			id = replies[0]
			console.log err if err
			@socket.set("playerId", id, => console.log "player #{id} saved")
			@socket.join(@data.name)
			@io.sockets.in(@data.name + ".host").emit "join", { id: id }
			redis_client.quit()
	
	@on move: ->
		#console.log(1);
		@socket.get "host", (err, host) =>
			@socket.get "playerId", (err, id) =>
				@io.sockets.in(host + ".host").emit "move", { x: @data.x, y: @data.y, player: id }


