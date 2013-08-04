# friendpipe

Send files to your friends from the command line.

Inspired by [#86 Friend Pipe](https://github.com/samsquire/ideas#86-friend-pipe)

## Unfinished! The below is just the proposed API.

## Install

    npm install -g friendpipe

## Usage

Let's start by configuring outgoing email:

    friend set smtp.host smtp.example.com
    friend set smtp.port 25
    friend set smtp.sender jason@onehackoranother.com

Next let's add some friends:

    friend add jason mailto:jason@onehackoranother.com
    friend add bob mailto:bob@example.com
    
Now we can send files:

    # send a single file
    friend send foo.jpg jason
    
    # or pipe
    cat foo.jpg | friend send jason bob
    
    # with manual mime type:
    cat kitteh.png | friend send --type=image/png bob
    
    # add a subject line:
    
## Extending

Protocol handlers are implemented in npm modules named according to.

For example, to implement a webdav protocol handler you would call your module `friendpipe-webdav-handler`.