# testcafe-reporter-tap
[![Build Status](https://travis-ci.org/willscripted/testcafe-reporter-tap.svg)](https://travis-ci.org/willscripted/testcafe-reporter-tap)

This is the **tap** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/bracket-software/testcafe-reporter-tap/master/media/preview.png" alt="preview" />
</p>

## Install

```
npm install testcafe-reporter-tap
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter tap
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('tap') // <-
    .run();
```

## Author

[ProdPerfect](https://www.prodperfect.com/).

## License

MIT. See [LICENSE](https://github.com/prodperfect/testcafe-reporter-tap/blob/master/LICENSE).
