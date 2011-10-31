@include = ->

	@on host: ->
		redis_client = @redis_client();
		@socket.set("host", @data.name, => console.log "room #{@data.room} saved")
		@socket.join(@data.name)
		@socket.join(@data.name + ".host")
		@emit host_joined: { name: @data.name } 
		redis_client.zadd("bashing::hosts", 0, @data.name)

	@on play: ->
		redis_client = @redis_client();
		@socket.set("host", @data.name, => console.log "room #{@data.room} saved")
		@socket.join(@data.name)
		@emit host_joined: { name: @data.name } 
	
	@on client_send: ->
		@socket.get "host", (err, host) =>
			console.log "got " + host
			@io.sockets.in(host + ".host").emit "client_message", { text: @data.text + "<- on host"}
			@io.sockets.in(host).emit "client_message", { text: @data.text }
			# @socket.broadcast.to(host).emit "client_message", { text: @data.text }

