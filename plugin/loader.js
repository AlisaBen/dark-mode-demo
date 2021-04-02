const loaderUtils = require('loader-utils');
const path = require('path');
const { lessLoaderOptions } = require('./constants');

const loadedThemedStylesPath = path.join(__dirname, '../src/lib/loadThemedStyles.js');

function loader(content) {
  console.log('-------')
  console.log(content);
  const { namedExport, async = false } = loaderUtils.getOptions(this) || {};
  let exportName = 'module.exports';
  if (namedExport) {
    exportName += `.${namedExport}`;
  }
  let contentList = content.split('\n');
  const headImport = contentList.filter(item => item.includes("import")).join("\n");
  const tailExport = contentList.filter(item => item.includes("export default"))[0].split("export default ")[1]
  const middleContent = contentList.filter(item => !item.includes("import") && !item.includes("export default")).join('\n');

  const code = [
    headImport,
    'var data = (function (module) {',
    'var css = { id: module.id, exports: {} };',
    '(function (module) {',
    middleContent,
    `return ${tailExport}`,
    '})(css);',
    'return css.exports;',
    '}) (module);',
    `var loader = require(${JSON.stringify(loadedThemedStylesPath)});`,
    '',
    'if(typeof data === "string") data = [[module.id, data]];',
    '',
    '// add the styles to the DOM',
    `for (var i = 0; i < data.length; i++) loader.loadStyles(data[i][1], ${async === true});`,
    '',
    `if(data.locals) ${exportName} = data.locals;`,
  ].join('\n');
  console.log(code)
  return code
}

function pitch() {
  const { loaders } = this;

  this.loaders = loaders.map(
    (loader) => {
      if (loader.path === require.resolve('less-loader')) {
        return {
          ...loader,
          options: this._compiler.hooks[lessLoaderOptions].call(loader.options),
        };
      }
      return loader;
    }
  );
}

module.exports = loader;
module.exports.pitch = pitch;
