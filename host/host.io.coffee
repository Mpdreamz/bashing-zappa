@include = ->
	@on host: ->
		redis_client = @redis_client()
		@socket.set("host", @data.name, => console.log "room #{@data.room} saved")
		@socket.join(@data.name)
		@socket.join(@data.name + ".host")
		redis_client.zadd("bashing::hosts", 0, @data.name)
		redis_client.quit()
	
	@on disconnect: ->
		@socket.get "host", (err, host) =>
			if err
				console.log err
				return
			redis_client = @redis_client()
			redis_client.multi([
			    ["zrem", "bashing::hosts", host],
			])
			.exec (err, replies) => 
				if err
					console.log err
					return
				@io.sockets.in(host).emit "host_died"

