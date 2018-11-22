var assert           = require('assert');
var normalizeNewline = require('normalize-newline');
var read             = require('read-file-relative').readSync;
var createReport     = require('./utils/create-report');
var _                = require('lodash');

var TestRunErrorFormattableAdapter = require('testcafe').embeddingUtils.TestRunErrorFormattableAdapter;
var UncaughtErrorOnPage            = require('testcafe').embeddingUtils.testRunErrors.UncaughtErrorOnPage;

function makeErrors (errDescrs) {
    return errDescrs.map(function (descr) {
        return new TestRunErrorFormattableAdapter(descr.err, descr.metaInfo);
    });
}

it('shows failed tests as \'not ok\'', function () {
    var calls = [
        {
            method: 'reportTaskStart',
            args:   [
                new Date('1970-01-01T00:00:00.000Z'),
                [
                    'Chrome 41.0.2227 / Mac OS X 10.10.1',
                    'Firefox 47 / Mac OS X 10.10.1'
                ],
                7
            ]
        },
        {
            method: 'reportFixtureStart',
            args:   [
                'First fixture',
                './fixture1.js'
            ]
        },
        {
            method: 'reportTestDone',
            args:   [
                'First test in first fixture',
                {
                    errs: makeErrors([
                        {

                            err: new UncaughtErrorOnPage('Some error', 'http://example.org'),

                            metaInfo: {
                                userAgent:      'Chrome 41.0.2227 / Mac OS X 10.10.1',
                                screenshotPath: '/screenshots/1445437598847/errors',
                                testRunState:   'inTest'
                            }
                        }
                    ]),
                    durationMs:     74000,
                    unstable:       false,
                    screenshotPath: '/screenshots/1445437598847'
                }
            ]
        }
    ];

    var lines = createReport(calls).split('\n');

    var okLines = _.filter(lines, RegExp.prototype.test.bind(/^ok /));
    var notOkLines = _.filter(lines, RegExp.prototype.test.bind(/^not ok /));

    assert.ok(okLines.length === 0);
    assert.ok(notOkLines.length === 1);

});

it('shows passing tests as \'ok\'', function () {
    var calls = [
        {
            method: 'reportTaskStart',
            args:   [
                new Date('1970-01-01T00:00:00.000Z'),
                [
                    'Chrome 41.0.2227 / Mac OS X 10.10.1',
                    'Firefox 47 / Mac OS X 10.10.1'
                ],
                7
            ]
        },
        {
            method: 'reportFixtureStart',
            args:   [
                'First fixture',
                './fixture1.js'
            ]
        },
        {
            method: 'reportTestDone',
            args:   [
                'First test in first fixture',
                {
                    errs:           [],
                    durationMs:     74000,
                    unstable:       true,
                    screenshotPath: '/screenshots/1445437598847'
                }
            ]
        }
    ];

    var lines = createReport(calls).split('\n');

    var okLines = _.filter(lines, RegExp.prototype.test.bind(/^ok /));
    var notOkLines = _.filter(lines, RegExp.prototype.test.bind(/^not ok /));

    assert.ok(okLines.length === 1);
    assert.ok(notOkLines.length === 0);

});

it('has a version line', function () {
    var calls = [
        {
            method: 'reportTaskStart',
            args:   [
                new Date('1970-01-01T00:00:00.000Z'),
                [
                    'Chrome 41.0.2227 / Mac OS X 10.10.1',
                    'Firefox 47 / Mac OS X 10.10.1'
                ],
                1
            ]
        }
    ];
    var report = createReport(calls);
    var lines = report.split('\n');

    assert.strictEqual(lines[0], 'TAP version 13');

});

it('has a test plan', function () {
    var testCount = 6;
    var calls = [
        {
            method: 'reportTaskStart',
            args:   [
                new Date('1970-01-01T00:00:00.000Z'),
                [
                    'Chrome 41.0.2227 / Mac OS X 10.10.1',
                    'Firefox 47 / Mac OS X 10.10.1'
                ],
                testCount
            ]
        }
    ];
    var report = createReport(calls);
    var lines = report.split('\n');

    assert.strictEqual(lines[1], `1..${testCount}`);
});

xit('allows TODO directives');
xit('allows SKIP directives');

it('handles guards against fixtures that start with numbers', function () {
    var fixtureTitle = '111';
    var calls = [
        {
            method: 'reportTaskStart',
            args:   [
                new Date('1970-01-01T00:00:00.000Z'),
                [
                    'Chrome 41.0.2227 / Mac OS X 10.10.1',
                    'Firefox 47 / Mac OS X 10.10.1'
                ],
                7
            ]
        },
        {
            method: 'reportFixtureStart',
            args:   [
                fixtureTitle,
                './fixture1.js'
            ]
        },
        {
            method: 'reportTestDone',
            args:   [
                'First test in first fixture',
                {
                    errs:           [],
                    durationMs:     74000,
                    unstable:       true,
                    screenshotPath: '/screenshots/1445437598847'
                }
            ]
        }
    ];

    var report = createReport(calls);
    var lines = report.split('\n');

    lines.forEach(function (line) {
        assert.ok(!/^(not )?ok 111/.test(line));
    });

});

it('handles guards against titles that start with numbers', function () {
    var testTitle = '111';
    var calls = [
        {
            method: 'reportTaskStart',
            args:   [
                new Date('1970-01-01T00:00:00.000Z'),
                [
                    'Chrome 41.0.2227 / Mac OS X 10.10.1',
                    'Firefox 47 / Mac OS X 10.10.1'
                ],
                7
            ]
        },
        {
            method: 'reportFixtureStart',
            args:   [
                'First fixture',
                './fixture1.js'
            ]
        },
        {
            method: 'reportTestDone',
            args:   [
                testTitle,
                {
                    errs:           [],
                    durationMs:     74000,
                    unstable:       true,
                    screenshotPath: '/screenshots/1445437598847'
                }
            ]
        }
    ];

    var report = createReport(calls);
    var lines = report.split('\n');

    lines.forEach(function (line) {
        assert.ok(!/^(not )?ok 111/.test(line));
    });

});

xit('includes descriptions');
xit('has test numbers');
xit('includes info about failed tests');

var reporterTestCalls   = require('./utils/reporter-test-calls');

it('Should produce TAP report', function () {
    var report   = createReport(reporterTestCalls);
    var expected = read('./data/tap-report');

    report   = normalizeNewline(report).trim();
    expected = normalizeNewline(expected).trim();

    assert.strictEqual(report, expected);
});
