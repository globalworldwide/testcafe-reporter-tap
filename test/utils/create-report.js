var buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin;
var pluginFactory       = require('../../lib');

module.exports = function createReport (testCalls) {
    var outStream = {
        data: '',

        write: function (text) {
            this.data += text;
        }
    };

    var plugin = buildReporterPlugin(pluginFactory, outStream);

    testCalls.forEach(function (call) {
        plugin[call.method].apply(plugin, call.args);
    });

    return outStream.data;
};
