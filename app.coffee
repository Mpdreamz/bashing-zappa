require("zappa") 'localhost', 8080, ->
	# bodyParser -- parses POSTS bodies (application/form or text/json)
	# @app.router -- todo: what does this instruct exactly ?
	# static -- instructs express to serve files in that folder as statics
	@use 'bodyParser', @app.router, static: __dirname + '/static',
	
	@set views: __dirname,
	@set "view options", { layout: __dirname + "/shared/layout.html" }
	
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
			@render "/shared/index.html", 
				foo: "bar", 
				hosts: hosts
				title: "Index!"

