@include = ->

	@get "/play/:name" : ->
		@render gameplay: { name: @params.name }

	@client "/play/js/socket.js" : ->
		@on connect: ->
			@emit play: { name: GameHost.name }
		@on host_joined: ->
			console.log "host_created: " + @data.name
		@on client_message: ->
			alert @data.text
		@connect();
		$ =>
			$("#sub").bind("click action", => @emit client_send: { text: $("#text").val() } )
	
	@view gameplay: ->
		@scripts = ["/play/js/socket.js"]
		@client_state = "window.GameHost = { name: \"#{@name}\"}"
		@title = "Bashing.Zappa player"
		h1 @host
		h2 "emit"
		label "Room name"
		input type: "text", id: "text", name: "room"
		input type: "submit", id: "sub"