@include = ->

	#include host server io event handlers
	@include "host/host.io.coffee"

	@get "/host/:name" : ->
		@render "/host/host.html",
			layout: false,
			title: "Gamepje",
			name: @params.name,
			scripts: ["/host/js/socket.js"]

	@post "/game/create" : ->
		@redirect "/host/" + @body.name
	
	@post "/game/play" : ->
		@redirect "/play/" + @body.name

	@client "/host/js/socket.js" : ->
		@on connect: ->
			@emit host: { name: GameHost.name, host: true }
		@on join: ->
			game.handleInput 'join', @data
		@on move: ->
			game.handleInput 'move', @data
		@connect();

