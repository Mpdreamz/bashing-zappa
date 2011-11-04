@include = ->
	
	@include "host/host.io.coffee"

	@get "/host/:name" : ->
		#@render gamehost: { name: @params.name }
		@render "/host/index.html", 
			foo: "bar", 
			name: @name,
			title: "Gamepje"
	
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

