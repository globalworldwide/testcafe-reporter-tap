const mustache = require('mustache').render;

const template = `TAP version 13
1..{{ testCount }}
{{# fixtures}}{{# tests}}{{> testResult}}{{/ tests}}{{/ fixtures}}
`;

const testResultTemplate = `{{#hasErrors}}not {{/hasErrors}}ok {{#skipped}}# skip {{/skipped}}- {{name}}
{{#hasErrors}}  ---
{{{errorDetails}}}...
{{/hasErrors}}`;

module.exports = function (model) {
    return mustache(template, model, {
        testResult: testResultTemplate
    });
};
