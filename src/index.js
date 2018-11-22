module.exports = function () {
    return {
        reportTaskStart (startTime, userAgents, testCount) {

            this.write('TAP version 13')
              .newline();

            this.write(`1..${testCount}`)
              .newline();

        },

        reportFixtureStart (/* name, path */) {
        },

        reportTestDone (name, testRunInfo) {

            const result = testRunInfo.errs.length === 0 ? `ok` : `not ok`;
            const testNumber = '';
            const description = name;
            const directive = '';

            this.write(`${result} ${testNumber ? testNumber + ' ' : ''}- ${description}${directive ? ' ' + directive : ''}`)
                .newline();

        },

        reportTaskDone (/* endTime, passed, warning */) {
        }
    };
};
