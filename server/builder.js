/**
 * @package     freecaster/skin-builder
 * @component   SkinController
 * @author      Maxime Bartier <maxime.bartier@freecaster.com>
 * @copyright   Freecaster SPRL 2019
 */
const fs = require("fs");
const { resolve } = require("path");
const sass = require("node-sass");
const consola = require("consola");

const nodeEnv = process.env.NODE_ENV;
const context = resolve(__dirname, "./../");
const entryFile = `${context}/assets/sass/app.scss`;
const dist = `${context}/dist`;

const options = {
  includePaths: [],
  outputStyle: nodeEnv === "production" ? "compressed" : "compact",
  sourceMap: nodeEnv === "production" ? true : false
};

/**
 * formating import and variable from scss files
 */
const formater = {
  var: (name, value) => `$${name}: '${value}';`,
  _import: path => `@import '${path}';`,
  build: varsOBJ => {
    return Object.keys(varsOBJ)
      .map(name => {
        const test = formater.var(name, varsOBJ[name]);
        return test;
      })
      .join("\n");
  }
};

/**
 * builder function
 * @param {Objcet} params
 */
const builder = ({ scssEntry, outFile, variables, success, error }) => {
  const { build, _import } = formater;
  const dataString = build(variables) + _import(scssEntry);

  const sassOptions = {
    ...options,
    ...{
      data: dataString,
      importer: url => {
        if (url[0] === "~") url = resolve("node_modules", url.substr(1));
        return { file: url };
      },
      outFile
    }
  };

  sass.render(sassOptions, (err, result) => {
    return err ? error(err) : success(result.css.toString());
  });
};

/**
 * @return {String}
 */
const constructOutPut = () => {
  const folder = `${dist}/assets`
  fs.mkdirSync(folder, { recursive: true })
  return `${folder}/style.css`
}

/**
 * render function
 * @param {Object} params
 */
module.exports = () => {
  const outFile = constructOutPut();
  builder({
    scssEntry: entryFile,
    outFile,
    variables: {},
    success: res => {
      fs.writeFile(outFile, res, err => {
        if (err) {
          consola.error("😡 Faild");
          consola.error(err);
          return
        }
        consola.success("💪👏 Skin successfully build 🍕🎉");
      });
    },
    error: err => {
      consola.error(`😡 Build faild: ${err.message}`);
      consola.error(err.formatted);
    }
  });
};
