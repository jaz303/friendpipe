var Registry    = {},
    prefix      = "/usr/local";

function protocolModuleName(protocol) {
    return 'friendpipe-protocol-' + protocol;
}

function isProtocolValid(protocol) {
    return protocol.match(/^[a-z]+$/);
}

function tryLoad(protocol) {
    
    if (!isProtocolValid(protocol))
        throw "invalid protocol name: " + protocol;

    if (protocol in Registry)
        return;

    try {
        Registry[protocol] = require(prefix + "/lib/node_modules/" + protocolModuleName(protocol));
    } catch (e) {
        Registry[protocol] = false;
    }

}

exports.protocolFromURL = function(address) {
    var matches = address.match(/^([a-z]+):/);
    return matches ? matches[1] : null;
}

exports.load = function(protocol) {
    tryLoad(protocol);
    if (!Registry[protocol]) {
        throw "protocol '" + protocol + "' could not be loaded. maybe try 'npm install " + protocolModuleName(protocol) + "'";
    }
    return Registry[protocol];
}

exports.exists = function(protocol) {
    tryLoad(protocol);
    return !!Registry[protocol];
}