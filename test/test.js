var assert = require('assert')
var _ = require('lodash')
var yaml = require('js-yaml')

var TestRunErrorFormattableAdapter =
  require('testcafe').embeddingUtils.TestRunErrorFormattableAdapter
var UncaughtErrorOnPage = require('testcafe').embeddingUtils.testRunErrors.UncaughtErrorOnPage

var createReport = require('./utils/create-report')

function makeErrors(errDescrs) {
  return errDescrs.map(function (descr) {
    return new TestRunErrorFormattableAdapter(descr.err, descr.metaInfo)
  })
}

it("shows failed tests as 'not ok'", function () {
  var calls = [
    {
      method: 'reportTaskStart',
      args: [new Date('1970-01-01T00:00:00.000Z'), ['SomeBrowser'], 7],
    },
    { method: 'reportFixtureStart', args: ['First fixture', './fixture1.js'] },
    {
      method: 'reportTestDone',
      args: [
        'First test in first fixture',
        {
          errs: makeErrors([
            {
              err: new UncaughtErrorOnPage('Some error', 'http://example.org'),
              metaInfo: {},
            },
          ]),
        },
      ],
    },
    { method: 'reportTaskDone', args: [new Date('1970-01-01T00:15:25.000Z'), 4, []] },
  ]

  var lines = createReport(calls).split('\n')

  var okLines = _.filter(lines, RegExp.prototype.test.bind(/^ok /))
  var notOkLines = _.filter(lines, RegExp.prototype.test.bind(/^not ok /))

  assert.ok(okLines.length === 0)
  assert.ok(notOkLines.length === 1)
})

it("shows passing tests as 'ok'", function () {
  var calls = [
    {
      method: 'reportTaskStart',
      args: [new Date('1970-01-01T00:00:00.000Z'), ['Some useragent'], 7],
    },
    { method: 'reportFixtureStart', args: ['First fixture', './fixture1.js'] },
    { method: 'reportTestDone', args: ['First test in first fixture', { errs: [] }] },
    { method: 'reportTaskDone', args: [new Date('1970-01-01T00:15:25.000Z'), 4, []] },
  ]

  var lines = createReport(calls).split('\n')

  var okLines = _.filter(lines, RegExp.prototype.test.bind(/^ok /))
  var notOkLines = _.filter(lines, RegExp.prototype.test.bind(/^not ok /))

  assert.ok(okLines.length === 1)
  assert.ok(notOkLines.length === 0)
})

it('has a version line', function () {
  var calls = [
    {
      method: 'reportTaskStart',
      args: [new Date('1970-01-01T00:00:00.000Z'), ['Some useragent'], 7],
    },
    { method: 'reportTaskDone', args: [new Date('1970-01-01T00:15:25.000Z'), 4, []] },
  ]
  var report = createReport(calls)
  var lines = report.split('\n')

  assert.strictEqual(lines[0], 'TAP version 13')
})

it('has a test plan', function () {
  var testCount = 6
  var calls = [
    {
      method: 'reportTaskStart',
      args: [new Date('1970-01-01T00:00:00.000Z'), ['Some useragent'], testCount],
    },
    { method: 'reportTaskDone', args: [new Date('1970-01-01T00:15:25.000Z'), 4, []] },
  ]
  var report = createReport(calls)
  var lines = report.split('\n')

  assert.strictEqual(lines[1], `1..${testCount}`)
})

it('allows SKIP directives', function () {
  var calls = [
    {
      method: 'reportTaskStart',
      args: [new Date('1970-01-01T00:00:00.000Z'), ['Some useragent'], 7],
    },
    { method: 'reportFixtureStart', args: ['First fixture', './fixture1.js'] },
    {
      method: 'reportTestDone',
      args: ['First test in first fixture', { errs: [], skipped: true }],
    },
    { method: 'reportTaskDone', args: [new Date('1970-01-01T00:15:25.000Z'), 4, []] },
  ]

  var report = createReport(calls)
  var lines = report.split('\n')

  var skippedLines = _.filter(lines, RegExp.prototype.test.bind(/ok (\d )?# skip /))

  assert.ok(skippedLines.length === 1)
})

it('handles guards against fixtures that start with numbers', function () {
  var fixtureTitle = '111'
  var calls = [
    {
      method: 'reportTaskStart',
      args: [new Date('1970-01-01T00:00:00.000Z'), ['Some useragent'], 7],
    },
    { method: 'reportFixtureStart', args: [fixtureTitle, './fixture1.js'] },
    { method: 'reportTestDone', args: ['First test in first fixture', { errs: [] }] },
    { method: 'reportTaskDone', args: [new Date('1970-01-01T00:15:25.000Z'), 4, []] },
  ]

  var report = createReport(calls)
  var lines = report.split('\n')

  assert.ok(lines.length > 3)
  lines.forEach(function (line) {
    assert.ok(!/^(not )?ok 111/.test(line))
  })
})

it('handles guards against titles that start with numbers', function () {
  var testTitle = '111'
  var calls = [
    {
      method: 'reportTaskStart',
      args: [new Date('1970-01-01T00:00:00.000Z'), ['SomeBrowser'], 7],
    },
    { method: 'reportFixtureStart', args: ['First fixture', './fixture1.js'] },
    { method: 'reportTestDone', args: [testTitle, { errs: [] }] },
    { method: 'reportTaskDone', args: [new Date('1970-01-01T00:15:25.000Z'), 4, []] },
  ]

  var report = createReport(calls)
  var lines = report.split('\n')

  lines.forEach(function (line) {
    assert.ok(!/^(not )?ok 111/.test(line))
  })
})

it('includes info about failed tests', function () {
  var calls = [
    {
      method: 'reportTaskStart',
      args: [new Date('1970-01-01T00:00:00.000Z'), ['SomeBrowser'], 7],
    },
    { method: 'reportFixtureStart', args: ['First fixture', './fixture1.js'] },
    {
      method: 'reportTestDone',
      args: [
        'First test in first fixture',
        {
          errs: makeErrors([
            {
              err: new UncaughtErrorOnPage('Some error', 'http://example.org'),
              metaInfo: {},
            },
          ]),
        },
      ],
    },
    { method: 'reportTaskDone', args: [new Date('1970-01-01T00:15:25.000Z'), 4, []] },
  ]

  var report = createReport(calls)
  var lines = report.split('\n')

  var idxYamlStart = _.findIndex(lines, RegExp.prototype.test.bind(/^\s+---/))
  var idxYamlEnd = _.findIndex(lines, RegExp.prototype.test.bind(/^\s+\.\.\./))

  var errorYaml = _.slice(lines, 1 + idxYamlStart, idxYamlEnd).join('\n')
  var info = yaml.load(errorYaml)

  assert(_.has(info, 'errors'))
  assert(_.has(info, 'severity'))
})
