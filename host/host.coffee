@include = ->

	#include host server io event handlers
	@include "host/host.io.coffee"

	@get "/host/:name" : ->
		@render "/host/host.html", 
			scripts: ["/host/js/socket.js"],
			foo: "bar", 
			name: @params.name,
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

