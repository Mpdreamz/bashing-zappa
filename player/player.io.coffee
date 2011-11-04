@include = ->

	@on play: ->
		redis_client = @redis_client();
		@socket.set("host", @data.name, => console.log "join for #{@data.name} received")
		redis_client.incr "bashing::player.serial", (err, id) =>
			console.log err if err
			@socket.set("playerId", id, => console.log "player #{id} saved")
			@socket.join(@data.name)
			@emit host_joined: { name: @data.name } 
	
	@on client_send: ->
		@socket.get "host", (err, host) =>
			console.log "got " + host
			@io.sockets.in(host + ".host").emit "client_message", { text: @data.text + "<- on host"}
			@io.sockets.in(host).emit "client_message", { text: @data.text }
			# @socket.broadcast.to(host).emit "client_message", { text: @data.text }
	
	@on touchmoved: ->
		@socket.get "host", (err, host) =>
			@socket.get "playerId", (err, id) =>
				@io.sockets.in(host + ".host").emit "touchmoved", { x: @data.x, y: @data.y, player: id }

