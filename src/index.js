var yaml = require('js-yaml');

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
            const directive = '';
            const skip = testRunInfo.skipped ? `# skip ` : '';

            this.write(`${result} ${testNumber ? testNumber + ' ' : ''}${skip}- ${name}${directive ? ' ' + directive : ''}`)
                .newline();

            if (testRunInfo.errs.length !== 0) {

                this.write(`  ---`)
                    .newline();

                var errors = JSON.parse(
                    JSON.stringify(
                        testRunInfo.errs
                    )
                );

                var errorYaml = yaml.safeDump({
                    errors:   errors,
                    severity: 'fail'
                }).split('\n').join('\n  ');

                this.write('  ' + errorYaml);

                this.write(`\n  ...`)
                    .newline();

            }

        },

        reportTaskDone (/* endTime, passed, warning */) {
        }
    };
};
