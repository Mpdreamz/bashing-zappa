require("zappa") 'localhost', 8080, ->
	# bodyParser -- parses POSTS bodies (application/form or text/json)
	# @app.router -- todo: what does this instruct exactly ?
	# static -- instructs express to serve files in that folder as statics
	@use 'bodyParser', @app.router, static: __dirname + '/static',

	#root view resolver to basedir
	@set views: __dirname,
	
	# serve html files not in /static with the ejs view engine
	@register html: require('ejs')
		
	# helpers are available in both io and http handlers
	@helper redis_client: ->
		redis = require("redis")
		redis.createClient()

	# everything serving the host related resources
	@include "./host/host.coffee"

	# everything serving the player related resources
	@include "./player/player.coffee"

	@get "/" : ->
		@redis_client().zrange "bashing::hosts", 0, -1, (err, hosts) =>
			console.log hosts
			@render "/shared/index.html", 
				foo: "bar", 
				hosts: hosts
				title: "Index!"