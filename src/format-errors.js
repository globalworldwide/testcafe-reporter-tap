const yaml = require('js-yaml')
const { pipe } = require('ramda')

module.exports = formatErrors

function formatErrors(errors) {
  return pipe(JSON.stringify, JSON.parse, yaml.dump, leftPad)({ errors: errors, severity: 'fail' })
}

function leftPad(text) {
  var output = ('  ' + text).split('\n')

  return output.join('\n  ')
}
