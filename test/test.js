var assert           = require('assert');
var normalizeNewline = require('normalize-newline');
var read             = require('read-file-relative').readSync;
var createReport     = require('./utils/create-report');

xit('Should start with a TAP version line');
xit('Should report the number of tests that will run');
xit('Should include a description');
xit('Should safely handle descriptions that start with numbers');
xit('Should allow TODO directives');
xit('Should allow SKIP directives');
xit('Should allow test numbers');

it('Should produce report without colors', function () {
    var report   = createReport(false);
    var expected = read('./data/report-without-colors');

    report   = normalizeNewline(report).trim();
    expected = normalizeNewline(expected).trim();

    assert.strictEqual(report, expected);
});
