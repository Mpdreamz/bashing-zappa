@include = ->
	@on host: ->
		redis_client = @redis_client()
		@socket.set("host", @data.name, => console.log "room #{@data.room} saved")
		@socket.set("type", "host")
		@socket.join(@data.name)
		@socket.join(@data.name + ".host")
		redis_client.zadd("bashing::hosts", 0, @data.name)
		redis_client.quit()
	
	@on disconnect: ->
		@socket.get "host", (err, host) =>
			return console.log(err) if err?
			@socket.get "type", (err, type) =>
				console.log("#{type} disconnected on host:#{host}")
				return console.log(err) and redis_client.quit() if err
				redis_client = @redis_client()
				if type == "host"
					redis_client.zscore "bashing::hosts", host, (err, onlineplayers) =>
						console.log("host #{host} score {#onlineplayers}")
						return console.log(err) and redis_client.quit() if err
						redis_client.multi([
							["incrby", "bashing::online.players", 0-onlineplayers]
						    ["zrem", "bashing::hosts", host],
						])
						.exec (err, replies) => 
							return console.log(err) and redis_client.quit() if err
							@io.sockets.in(host).emit "host_died"
							redis_client.quit()
				if type == "player"
					redis_client.multi([
					    ["zincrby", "bashing::hosts", -1, host],
					    ["incrby", "bashing::online.players", -1]
					])
					.exec (err, replies) => 
						return console.log(err) and redis_client.quit() if err
						@io.sockets.in(host + ".host").emit "player_died"
						redis_client.quit()

