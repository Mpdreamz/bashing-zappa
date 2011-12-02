#Installing

## Install on Ubuntu

Optional (since Zappa now works with Node 0.6):
Install nvm:
https://github.com/creationix/nvm

```
nvm install v0.4.12
```

Mandatory:
```

curl http://npmjs.org/install.sh | sudo sh

sudo add-apt-repository ppa:rwky/redis
sudo apt-get update
sudo apt-get install redis-server

cd bashing-zappa
npm install
```

##Install Windows
Download and install the latest nodejs msi installer from (nodejs.org)[http://nodejs.org/]

Make sure nodejs is in your PATH 

Download and install the latest redis for windows from https://github.com/dmajkic/redis/downloads

Download CoffeeScript: http://github.com/jashkenas/coffee-script/tarball/master and unzip it to somehwere.
Create coffee.cmd somewhere available to PATH (I just placed it next to node.exe):

```
@echo off
"%PROGRAMFILES%/Node/node.exe" "PATH_TO_COFFEE_SCRIPT/bin/coffee" %*
```

Install npm modules the game needs

```
cd bashing-zappa
npm install
```

#run
Make sure redis is running. On ubuntu it'll probably have autostarted.

```
npm start
```


