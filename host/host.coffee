@include = ->
	
	@include "host/host.io.coffee"

	@get "/host/:name" : ->
		@render gamehost: { name: @params.name }
	
	@post "/game/create" : ->
		@redirect "/host/" + @body.name
	
	@post "/game/play" : ->
		@redirect "/play/" + @body.name

	@client "/host/js/socket.js" : ->
		@on connect: ->
			@emit host: { name: GameHost.name, host: true }
		@on host_created: ->
			console.log "host_created: " + @data.name
		@on client_message: ->
			alert @data.text
		@connect();
	 
	@view gamehost: ->
		@scripts = ["/host/js/socket.js"]
		@client_state = "window.GameHost = { name: \"#{@name}\"}"
		@title = "Bashing.Zappa host:" + @name
		h1 @host