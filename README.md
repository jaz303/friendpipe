# friendpipe

Send files to your friends from the command line.

Inspired by [@samsquire](https://github.com/samsquire)'s [#86 Friend Pipe](https://github.com/samsquire/ideas#86-friend-pipe).

## Unfinished! The below is just the proposed API.

## Install

First install the CLI utility:

    npm install -g friendpipe

Then add a protocol handler. Only `mailto` exists right now :).

    npm install -g friendpipe-protocol-mailto

## Usage

Let's start by configuring SMTP:

    friend set smtp.host smtp.example.com
    friend set smtp.port 25
    friend set smtp.from jason@onehackoranother.com

Next let's add some friends:

    friend add jason mailto:jason@onehackoranother.com
    friend add bob mailto:bob@example.com
    
Now we can send files:

    # send a single file to a single person
    friend send foo.jpg jason

    # send multiple files multiple people
    # (args can be in any order, nicknames take precedence)
    friend send foo.jpg bar.png jason bob
    
    # pipe a file to a single recipient
    cat foo.jpg | friend send jason bob
    
    # with manual mime type:
    cat kitteh.png | friend send --type=image/png bob
    
    # set a custom subject line:
    friend send -s "check out this grizzly bear" bear.jpg jason
    
## Extending

Protocol handlers are implemented in npm modules named according to.

For example, to implement a webdav protocol handler you would call your module `friendpipe-protocol-webdav`.
