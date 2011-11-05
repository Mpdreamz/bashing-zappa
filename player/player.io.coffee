@include = ->

	@on play: ->
		redis_client = @redis_client();
		redis_client.zscore "bashing::hosts", @data.name, (err, onlineplayers) =>
			return console.log(err) and redis_client.quit() if err
			return redis_client.quit() && @emit("host_not_found") if onlineplayers == null
			@socket.set("host", @data.name, => console.log "join for #{@data.name} received")
			playername = @getRandomName()
			@socket.set("type", "player")
			@socket.set("playername", playername)
			redis_client.multi([
				["incr", "bashing::player.serial"],
				["zincrby", "bashing::hosts", 1, @data.name],
				["incr", "bashing::online.players"],
			]).exec (err, replies) =>
				id = replies[0]
				console.log err if err
				@socket.set("playerId", id, => console.log "player #{id} saved")
				@socket.join(@data.name)
				@io.sockets.in(@data.name + ".host").emit "join", { id: id, playername: playername }
				@emit joined: { id: id, playername: playername }
				redis_client.quit()
	
	@on move: ->
		#console.log(1);
		@socket.get "host", (err, host) =>
			@socket.get "playerId", (err, id) =>
				@io.sockets.in(host + ".host").emit "move", { x: @data.x, y: @data.y, player: id }


