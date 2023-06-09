# testcafe-reporter-tap

This is the **tap** reporter plugin for [TestCafe](http://devexpress.github.io/testcafe).

<p align="center">
    <img src="https://raw.github.com/globalworldwide/testcafe-reporter-tap/master/media/preview.png" alt="preview" />

</p>

## Install

```
npm install testcafe-reporter-tap-gww
```

## Usage

When you run tests from the command line, specify the reporter name by using the `--reporter` option:

```
testcafe chrome 'path/to/test/file.js' --reporter testcafe-reporter-tap-gww
```


When you use API, pass the reporter name to the `reporter()` method:

```js
testCafe
    .createRunner()
    .src('path/to/test/file.js')
    .browsers('chrome')
    .reporter('testcafe-reporter-tap-gww') // <-
    .run();
```

## Original Author

This is a fork of https://github.com/ProdPerfect/testcafe-reporter-tap by [ProdPerfect](https://www.prodperfect.com/).

## License

MIT. See [LICENSE](https://github.com/globalworldwide/testcafe-reporter-tap/blob/master/LICENSE).
