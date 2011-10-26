require("zappa") '192.168.1.13', 80, ->
	@use 'bodyParser', @app.router
	
	@redis = require("redis")
	@redis_client = @redis.createClient()

	@helper redis_client: ->
		redis = require("redis")
		redis.createClient()

	@get "/" : ->
		@redis_client().zrange "bashing::hosts", 0, -1, (err, hosts) =>
			console.log hosts
			@render index: { foo: "bar", hosts: hosts }
		
	
	@include "./host/host.coffee"

	@include "./player/player.coffee"

	@include "./server.io.coffee"
			
	@view index: ->
		@title = "Socket.IO zappa tests"
		h1 @title
		p @foo
		form action:"/game/create", method: "POST", ->
			h2 "Host a game"
			label "Room name"
			input type: "text", id: "room", name: "room"
			input type: "submit"
		ul ->
			for host in @hosts
				li host
	
	@view layout: ->
		doctype 5
		html -> 
			head -> 
				title @title
				script src: '/socket.io/socket.io.js'
				script src: '/zappa/zappa.js'
				script src: "http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"
				script(type: "text/javascript", @client_state) if @client_state		
				if @scripts
					for s in @scripts
						script src: s
				script(src: @script) if @script
				if @stylesheets
					for s in @stylesheets
						link rel: 'stylesheet', href: s
				if @stylesheet
					link(rel: 'stylesheet', href: @stylesheet)
				style @style if @style
			body @body



