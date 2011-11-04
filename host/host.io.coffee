@include = ->
	@on host: ->
		redis_client = @redis_client();
		@socket.set("host", @data.name, => console.log "room #{@data.room} saved")
		@socket.join(@data.name)
		@socket.join(@data.name + ".host")
		redis_client.zadd("bashing::hosts", 0, @data.name)
