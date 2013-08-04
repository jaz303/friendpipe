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
  "  -c --clipboard       Extract file contents from clipboard",
  "  -t TYPE --type=TYPE  Specify file MIME type explicitly"
];

var opts = require('docopt').docopt(doc.join("\n"));

function parseSendOptions(opts) {
  var out = {};
  out.clipboard = !!opts['--clipboard'];
  out.mimeType = opts['--type'];
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
  console.log("setting", key, "=>", value);
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
