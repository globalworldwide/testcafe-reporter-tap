const template = require('./template')
const formatErrors = require('./format-errors')

module.exports = function () {
  return {
    noColors: true,
    currentFixture: null,

    report: {
      total: 0,
      fixtures: [],
    },

    reportTaskStart(startTime, userAgents, testCount) {
      this.report.testCount = testCount
    },

    reportFixtureStart(name, path) {
      this.currentFixture = { name, path, tests: [] }
      this.report.fixtures.push(this.currentFixture)
    },

    reportTestDone(name, testRunInfo) {
      var hasErrors = testRunInfo.errs.length > 0
      var errorDetails = hasErrors ? formatErrors(testRunInfo.errs) : null

      // testcafe does not include skipped tests in the testCount, but TAP expects them
      if (testRunInfo.skipped) {
        ++this.report.testCount
      }

      this.currentFixture.tests.push({
        name,
        errorDetails,
        hasErrors,
        skipped: testRunInfo.skipped,
      })
    },

    reportTaskDone(/* endTime, passed, warnings */) {
      this.write(template(this.report))
    },
  }
}
