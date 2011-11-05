redis = require("redis")
require("zappa") 8080, ->
	#10.42.4.255
	# bodyParser -- parses POSTS bodies (application/form or text/json)
	# @app.router -- todo: what does this instruct exactly ?
	# static -- instructs express to serve files in that folder as statics
	@use 'bodyParser', @app.router, static: __dirname + '/static',

	#root view resolver to basedir
	@set views: __dirname,
	
	# serve html files not in /static with the ejs view engine
	@register html: require('ejs')
		
	# helpers are available in both io and http handlers
	redis_client = -> redis.createClient()
	@helper redis_client: ->
		redis.createClient()
	
	redis_flush = ->
		redis_client = redis_client();
		redis_client.flushall (err) ->
			console.log "flushed redis"
			redis_client.quit()
	
	# make sure we start clean as a whistle
	redis_flush()

	# everything serving the host related resources
	@include "./host/host.coffee"

	# everything serving the player related resources
	@include "./player/player.coffee"

	# random name routine
	@include "./shared/randomname.coffee"

	@helper getRandomName: =>
		@getName(3,8, null, null)

	@get "/" : ->
		redis_client = @redis_client();
		redis_client.zrevrangebyscore "bashing::hosts", 100000000, 0, "WITHSCORES", (err, hosts) =>
			redis_client.quit()
			console.log err if err
			@render "/shared/index.html", 
				foo: "bar", 
				hosts: hosts or []
				title: "Index!"


