var fs = require('fs');
var NO_OP = function() {};

function out(line) { process.stdout.write(line + "\n"); }
function err(line) { process.stderr.write(line + "\n"); }

doc = [
  "Usage:",
  "  friend add <nickname> <url>",
  "  friend remove <nickname>",
  "  friend send [options] <nicknames-or-files>...",
  "  friend set <config-key> <config-value>",
  "  friend -h | --help",
  "  friend -v | --version",
  "",
  "Options:",
  //"  -c --clipboard                 Extract file contents from clipboard",
  "  -t TYPE --type=TYPE            Specify file MIME type explicitly",
  "  -s SUBJECT --subject=SUBJECT   Subject line for supporting adapters"
];

function version() {
  return require('./package.json').version;
}

function fixSettings(settings) {
  
  if (!('friends' in settings)) {
    settings.friends = {};
  }
  
  if (!('config' in settings)) {
    settings.config = {};
  }
  
  return settings;

}

function settingsFile() {
  return process.env['HOME'] + '/.friendpipe';
}

function readSettings(cb) {
  fs.exists(settingsFile(), function(exists) {
    if (!exists) {
      cb(fixSettings({}));
      return;
    }
    fs.readFile(settingsFile(), {encoding: 'utf8'}, function(err, data) {
      if (err) {
        err("error reading config file");
        process.exit(1);
      }
      try {
        cb(fixSettings(JSON.parse(data)));
      } catch (e) {
        err("error parsing config file");
        process.exit(1);
      }
    });
  });
}

function writeSettings(cfg, cb) {
  fs.writeFile(settingsFile(), JSON.stringify(cfg, null, 4) + "\n", {encoding: 'utf8'}, function(err) {
    if (err) {
      err("error writing config file");
      process.exit(1);
    } else {
      cb();
    }
  });
}

function updateSettings(update, complete) {
  readSettings(function(settings) {
    var updatedSettings = update(settings);
    writeSettings(updatedSettings || settings, complete || NO_OP);
  });
}

function parseSendOptions(opts) {
  var out = {};
  out.clipboard = !!opts['--clipboard'];
  out.mimeType = opts['--type'] || null;
  out.subject = opts['--subject'] || null;
  return out;
}

function execAdd(nickname, url) {
  updateSettings(function(settings) {
    settings.friends[nickname] = url;
  });
}

function execRemove(nickname) {
  updateSettings(function(s) {
    if (!(nickname in s.friends)) {
      err("no such friend: " + nickname);
      return false;
    } else {
      delete s.friends[nickname];
    }
  });
}

function execSend(subjects, options) {
  console.log("sending:", subjects.join(','), options);
}

function execSet(key, value) {
  updateSettings(function(settings) {
    settings.config[key] = value;
  });
}

function showVersion() {
  out(version());
}

exports.run = function() {
  var opts = require('docopt').docopt(doc.join("\n")); 
  if (opts['-v'] || opts['--version']) {
    showVersion();
  } else if (opts.add) {
    execAdd(opts['<nickname>'], opts['<url>']);
  } else if (opts.remove) {
    execRemove(opts['<nickname>']);
  } else if (opts.send) {
    execSend(opts['<nicknames-or-files>'], parseSendOptions(opts));
  } else if (opts.set) {
    execSet(opts['<config-key>'], opts['<config-value>']);
  } else {
    throw "unknown command! :(";
  }
}

if (!module.parent) {
  exports.run();
}