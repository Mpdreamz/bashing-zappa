@include = ->
	@on host: ->
		host = @data.name
		return console.log("no host name received for host event") if host == null

		redis_client = @redis_client()
		redis_client.zadd("bashing::hosts", 0, host, (err) => redis_client.quit())
		@socket.set("host", host, => console.log "room #{host} saved")
		@socket.set("type", "host")
		@socket.join(@data.name)
		@socket.join(@data.name + ".host")
		
		
	
	@on disconnect: ->
		@socket.get "host", (err, host) =>
			return console.log(err) if err?
			@socket.get "type", (err, type) =>
				console.log("#{type} disconnected on host:#{host}")
				return console.log(err) and redis_client.quit() if err
				redis_client = @redis_client()
				if type == "host"
					redis_client.zscore "bashing::hosts", host, (err, onlineplayers) =>
						console.log("host #{host} score #{onlineplayers}, #{err}")
						return console.log(err) and redis_client.quit() if err
						redis_client.multi([
							["incrby", "bashing::online.players", 0-onlineplayers]
						    ["zrem", "bashing::hosts", host],
						])
						.exec (err, replies) => 
							console.log("removed host #{host}, {err}")
							return console.log(err) and redis_client.quit() if err
							@io.sockets.in(host).emit "host_died"
							redis_client.quit()
				if type == "player"
					redis_client.zrank "bashing::hosts", host, (err, count) =>
						commands = [["incrby", "bashing::online.players", -1]]
						#do not decrement hosts if it doesn't exists anymore
						commands.push(["zincrby", "bashing::hosts", -1, host]) if count != null
						redis_client.multi(commands).exec (err, replies) => 
							return console.log(err) and redis_client.quit() if err
							@io.sockets.in(host + ".host").emit "player_died"
							redis_client.quit()

