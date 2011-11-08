@include = ->

	#include host server io event handlers
	@include "player/player.io.coffee"

	@get "/play/:name" : ->
		redis_client = @redis_client();
		redis_client.zscore "bashing::hosts", @params.name, (err, onlineplayers) =>
			return redis_client.quit() && @redirect("/error/host_not_found/" + @params.name) if onlineplayers == null
			@render "/player/player.html", 
				layout: false, 
				name: @params.name,
				title: "Gamepje"
	
	@get "/mayhem/:name" : ->
		@render mayhem:
			layout: false, 
			name: @params.name 



	@view mayhem: ->
		@title = "MAYHEM!"
		script "window.GameHost = { name: '#{@name}' };"
		script src: "/socket.io/socket.io.js"
		script src: "/zappa/zappa.js"
		script src: "/mayhem/js/socket.js"	
		
	
	@client "/mayhem/js/socket.js" : ->
		socket = io.connect("192.168.1.15:8080")
		for i in [0...8]
			socket.on "connect", (data) ->
				socket.emit "play", { name: GameHost.name }
			socket.on "joined", (data) ->
				id = data.id
				console.log id
				setInterval ->
					x = Math.floor(Math.random() * 300) - 150
					y = Math.floor(Math.random() * 300) - 150
					socket.emit "move", { id: id, x:x, y:y }
				, 500

	@client "/play/js/socket.js" : ->
		window.emitter = this;
		@on connect: ->
			@emit play: { name: GameHost.name }
		@on host_died: ->
			window.location =  "/error/host_died/" + GameHost.name
		@on host_not_found: ->
			window.location =  "/error/host_not_found/" + GameHost.name
		@on joined: ->
			$ =>
				$("#player-information").css("background", "url(/img/units/unit#{(@data.id % 20)+1}.png) top left no-repeat")
				$("#player-information").append(@data.playername)
		@connect();
		#$ =>
		#	#FIXME bind werkt niet goed op Android
		#	$("#gamepad").bind "move", (e, data) =>
		#		$('#debug').html('aap');
		#		console.log(this);
		#		@emit move: data
		#	#$("#sub").bind("click action", => @emit client_send: { text: $("#text").val() } )

