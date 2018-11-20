var buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin;
var pluginFactory       = require('../../lib');
var reporterTestCalls   = require('./reporter-test-calls');

module.exports = function createReport () {
    var outStream = {
        data: '',

        write: function (text) {
            this.data += text;
        }
    };

    var plugin = buildReporterPlugin(pluginFactory, outStream);

    reporterTestCalls.forEach(function (call) {
        plugin[call.method].apply(plugin, call.args);
    });

    return outStream.data;
};
