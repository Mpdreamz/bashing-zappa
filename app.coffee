require("zappa") 'localhost', 8080, ->
	# bodyParser -- parses POSTS bodies (application/form or text/json)
	# @app.router -- todo: what does this instruct exactly ?
	# static -- instructs express to serve files in that folder as statics
	@use 'bodyParser', @app.router, static: __dirname + '/static',
	
	@set views: __dirname,
	@set "view options", { layout: "/shared/layout.html" }
	
	@register html: require('ejs');
		
	# helpers are available in both io and http handlers
	@helper redis_client: ->
		redis = require("redis")
		redis.createClient()

	# everything serving the host related resources
	@include "./host/host.coffee"

	# everything serving the player related resources
	@include "./player/player.coffee"

	# shared io code for both host and player
	@include "./server.io.coffee"
	
	@get "/" : ->
		@redis_client().zrange "bashing::hosts", 0, -1, (err, hosts) =>
			console.log hosts
			@render "/shared/index.html", { foo: "bar", hosts: hosts }
			
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
				meta charset: 'utf-8'
				title @title
				meta name: 'viewport', content: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'
				if @stylesheets
					for s in @stylesheets
						link rel: 'stylesheet', href: s
				if @stylesheet
					link(rel: 'stylesheet', href: @stylesheet)
				style @style if @style
			body @body
			script src: '/socket.io/socket.io.js'
			script src: '/zappa/zappa.js'
			script src: "http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"
			script(type: "text/javascript", @client_state) if @client_state		
			if @scripts
				for s in @scripts
					script src: s
			script(src: @script) if @script



