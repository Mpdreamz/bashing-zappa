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
				$("#player-information").css("background", "url(/img/units/unit#{@data.id % 20}.png) top left no-repeat")
				$("#player-information").append(@data.playername)
		@connect();
		#$ =>
		#	#FIXME bind werkt niet goed op Android
		#	$("#gamepad").bind "move", (e, data) =>
		#		$('#debug').html('aap');
		#		console.log(this);
		#		@emit move: data
		#	#$("#sub").bind("click action", => @emit client_send: { text: $("#text").val() } )

