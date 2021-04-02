const path = require("path");
const fs = require("fs");
const { override, fixBabelImports, addLessLoader, addWebpackPlugin } = require('customize-cra');
const AntDesignThemePlugin = require("./index");
const { getLessVars } = require('antd-theme-generator');

// getLessVars主要的工作就是通过正则匹配，匹配less文件中@***:***;格式，并将其转换为object
const themeVariables = getLessVars(path.join(__dirname, './src/styles/vars.less'))
const defaultVars = getLessVars('./node_modules/antd/lib/style/themes/default.less') // 从less文件生成json文件
const darkVars = { ...getLessVars('./node_modules/antd/lib/style/themes/dark.less'), '@primary-color': defaultVars['@primary-color'], '@picker-basic-cell-active-with-range-color': 'darken(@primary-color, 20%)' };
const lightVars = { ...getLessVars('./node_modules/antd/lib/style/themes/compact.less'), '@primary-color': defaultVars['@primary-color'] };
// 将json数据写入到文件中
fs.writeFileSync('./src/dark.json', JSON.stringify(darkVars));
fs.writeFileSync('./src/light.json', JSON.stringify(lightVars));
fs.writeFileSync('./src/theme.json', JSON.stringify(themeVariables));

// 这里传入的参数名，和generateTheme方法的入参保持一致
// antDir,
// antdStylesDir,
// stylesDir,
// varFile,
// outputFilePath,
// themeVariables = ["@primary-color"],
// customColorRegexArray = [],
const options = {
  stylesDir: path.join(__dirname, './src'), // 工程文件夹
  antDir: path.join(__dirname, './node_modules/antd'), // antd的文件夹
  varFile: path.join(__dirname, './src/styles/vars.less'), // 变量文件
  themeVariables: Array.from(new Set([
    ...Object.keys(darkVars),
    ...Object.keys(lightVars),
    ...Object.keys(themeVariables),
  ])), // 所有的主题变量
  generateOnce: true, // generate color.less on each compilation所有的变量会生成color.less文件
}


module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addWebpackPlugin(new AntDesignThemePlugin(options)),
  addLessLoader({
    javascriptEnabled: true,
  }),
);