var fs = require('fs');

doc = [
  "Usage:",
  "  friend add <nickname> <url>",
  "  friend update <nickname> <url>",
  "  friend send [options] <nicknames-or-files>...",
  "  friend set <config-key> <config-value>",
  "  friend -h | --help",
  "  friend -v | --version",
  "",
  "Options:",
  "  -c --clipboard                 Extract file contents from clipboard",
  "  -t TYPE --type=TYPE            Specify file MIME type explicitly",
  "  -s SUBJECT --subject=SUBJECT   Subject line for supporting adapters"
];

var opts = require('docopt').docopt(doc.join("\n"));

function configFile() {
  return process.env['HOME'] + '/.friendpipe';
}

function readConfig(cb) {
  fs.exists(configFile(), function(exists) {
    if (!exists) {
      cb({});
      return;
    }
    fs.readFile(configFile(), {encoding: 'utf8'}, function(err, data) {
      if (err) {
        process.stderr.write("error reading config file");
        process.exit(1);
      }
      try {
        cb(JSON.parse(data));
      } catch (e) {
        process.stderr.write("error parsing config file");
        process.exit(1);
      }
    });
  });
}

function writeConfig(cfg, cb) {
  fs.writeFile(configFile(), JSON.stringify(cfg) + "\n", {encoding: 'utf8'}, function(err) {
    if (err) {
      process.stderr.write("error writing config file");
      process.exit(1);
    } else {
      cb();
    }
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
  console.log("adding:", nickname, url);
}

function execUpdate(nickname, url) {
  console.log("updating:", nickname, url);
}

function execSend(subjects, options) {
  console.log("sending:", subjects.join(','), options);
}

function execSet(key, value) {
  readConfig(function(config) {
    config[key] = value;
    writeConfig(config, function() {

    });
  });
}

function showVersion() {
  console.log(module.version);
}

if (opts['-v'] || opts['--version']) {
  showVersion();
} else if (opts.add) {
  execAdd(opts['<nickname>'], opts['<url>']);
} else if (opts.update) {
  execUpdate(opts['<nickname>'], opts['<url>']);
} else if (opts.send) {
  execSend(opts['<nicknames-or-files>'], parseSendOptions(opts));
} else if (opts.set) {
  execSet(opts['<config-key>'], opts['<config-value>']);
} else {
  throw "unknown command! :(";
}
