const {generateTheme} = require("antd-theme-generator");
const webpack = require('webpack');
const {RawSource} = webpack.sources || require('webpack-sources');
const path = require("path");

class AntDesignThemePlugin {
  constructor(options) {
    console.log(path.join(__dirname, "../../src/styles/variables.less"))
    const defaultOptions = {
      varFile: path.join(__dirname, "../../src/styles/variables.less"),
      antDir: path.join(__dirname, "../../node_modules/antd"),
      stylesDir: path.join(__dirname, "../../src/styles/antd"),
      themeVariables: ["@primary-color"],
      indexFileName: "index.html",
      generateOnce: false,
      lessUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js",
      publicPath: ""
    }; // 默认配置
    this.options = Object.assign(defaultOptions, options); // options选项覆盖
    this.generated = false;
    this.version = webpack.version;
  }

  apply(compiler) {
    const pluginName = 'AntDesignThemePlugin';

    if (this.version.startsWith('5.')) {
      compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
        compilation.hooks.processAssets.tapAsync(
          {
            name: pluginName,
            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
          },
          (assets, callback) => this.addAssets(compilation, assets, callback)
        );
      });
    }
    else {
      compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) =>
        this.addAssets(compilation, compilation.assets, callback));
    }
  }

  addAssets(compilation, assets, callback) {
    this.generateIndexContent(assets, compilation); // 生成index.html的文件内容，添加window.less全局变量以及color.less的link

    if (this.options.generateOnce && this.colors) {
      console.log(this.colors)
      this.generateColorStylesheet(compilation, this.colors);
      return callback();
    }

    generateTheme(this.options) // 根据options配置，生成主题color.less文件
      .then(css => {
        if (this.options.generateOnce) {
          this.colors = css;
        }
        this.generateColorStylesheet(compilation, css); // 生成color.less文件
        callback();
      })
      .catch(err => {
        callback(err);
      });

  };

  // 生成index.html的文件内容，主要是添加link到html中
  generateIndexContent(assets, compilation) {
    if (
      this.options.indexFileName &&
      this.options.indexFileName in assets
    ) {
      const index = assets[this.options.indexFileName];
      let content = index.source();
      console.log(content)

      if (!content.match(/\/color\.less/g)) {
        const less = `
          <link rel="stylesheet/less" type="text/css" href="${this.options.publicPath}/color.less" />
          <script>
            window.less = {
              async: false,
              env: 'production'
            };
          </script>
          <script type="text/javascript" src="${this.options.lessUrl}"></script>
        `;

        const updatedContent = content.replace(less, "").replace(/<body>/gi, `<body>${less}`);

        // 将内容写会到this.options.indexFileName文件中
        if (this.version.startsWith('5.')) {
          compilation.updateAsset(this.options.indexFileName, new RawSource(updatedContent), { size: updatedContent.length });
          return;
        }

        index.source = () => updatedContent;
        index.size = () => updatedContent.length;
      }
    }
  };

  generateColorStylesheet(compilation, source) {
    // 生成color.less文件
    if (this.version.startsWith('5.')) {
      compilation.emitAsset('color.less', new RawSource(source), { size: source.length });
      return;
    }

    compilation.assets['color.less'] = {
      source: () => source,
      size: () => source.length
    };
  };
}


module.exports = AntDesignThemePlugin;
