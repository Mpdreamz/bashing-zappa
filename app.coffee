require("zappa") '192.168.1.13', 80, ->
	@use 'bodyParser', @app.router
	@get "/" : ->
		@render index: { foo: "bar" }

	@get "/host/:name" : ->
		@render gamehost: { name: @params.name }
	
	@client "/host/js/socket.js" : ->
		@on connect: ->
			@emit host: { name: GameHost.name, host: true }
		@on host_created: ->
			console.log "host_created: " + @data.name
		@on client_message: ->
			alert @data.text
		@connect();
	
	@on host: ->
		@socket.set("host", @data.name, => console.log "room #{@data.room} saved")
		@socket.join(@data.name)
		@socket.join(@data.name + ".host") if @data.host
		@emit host_created: { name: @data.name } if @data.host
		@emit host_joined: { name: @data.name } if not @data.host
	
	@on client_send: ->
		@socket.get "host", (err, host) =>
			console.log "got " + host
			@io.sockets.in(host+ ".host").emit "client_message", { text: @data.text + "<- on host"}
			@io.sockets.in(host).emit "client_message", { text: @data.text }
			# @socket.broadcast.to(host).emit "client_message", { text: @data.text }
			
			

	@post "/game/create" : ->
		@redirect "/host/" + @body.room

	@view gamehost: ->
		@scripts = ["/host/js/socket.js"]
		@client_state = "window.GameHost = { name: \"#{@name}\"}"
		@title = "Bashing.Zappa host:" + @name
		h1 @host

	@get "/play/:name" : ->
		@render gameplay: { name: @params.name }

	@client "/play/js/socket.js" : ->
		@on connect: ->
			@emit host: { name: GameHost.name }
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

	@view index: ->
		@title = "Socket.IO zappa tests"
		h1 @title
		p @foo
		form action:"/game/create", method: "POST", ->
			h2 "Host a game"
			label "Room name"
			input type: "text", id: "room", name: "room"
			input type: "submit"
	
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



