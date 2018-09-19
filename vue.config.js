// const fs = require('fs')
const path = require('path')
const merge = require('webpack-merge')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('assets', resolve('src/assets'))
    config.resolve.modules.add(resolve('src'))
    config.resolve.extensions.add('.css')
    config.resolve.extensions.add('.scss')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options =>
        merge(options, {
          loaders: {
            i18n: '@kazupon/vue-i18n-loader'
          }
        })
      )

    config.module
      .rule('svg')
      .use('file-loader')
      .loader('vue-svg-loader')

    config.module
      .rule('js')
      .include.add(resolve('./node_modules/element-ui/src'))
      .add(resolve('./node_modules/element-ui/packages'))

    config.module
      .rule('js')
      .exclude.add(resolve('./src/vendor/bitmain.min.js'))
      .add(resolve('./src/vendor/flv.min.js'))
      .add(resolve('./src/components/bdVideo/vendor'))

    // config.module
    //   .rule('eslint')
    //   .use('eslint-loader')
    //   .tap(options => merge(options, { quiet: true, emitWarning: false }))

    config.module.rule('eslint').exclude.add(resolve('./src/vendor'))

    if (process.env.NODE_ENV === 'production') {
      // config.output.path(resolve('../static'))
      // config.plugin('bundleAnalyze').use(BundleAnalyzerPlugin)
      config.plugin('gzip').use(CompressionPlugin, [
        {
          asset: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        }
      ])
    }

    // if (process.env.TARGET === 'DEV') {
    //   config.output.path(resolve('dist'))
    // }

    // config.plugin('define')
    //   .tap(args => [{
    //     'process.env': {
    //       ...args[0]['process.env'],
    //       API_HOST: '""',
    //       STOP_PERMIT: 'true'
    //     }
    //   }])
  },
  lintOnSave: 'error',
  // compiler: true,
  css: {
    // extract CSS in components into a single CSS file (only in production)
    extract: true,

    // enable CSS source maps?
    sourceMap: true,
    loaderOptions: {
      sass: {
        // data: `@import "@/assets/scss/_vars.scss";`
        // data: fs.readFileSync('src/assets/scss/_vars.scss', 'utf-8')
      }
    },
    // Enable CSS modules for all css / pre-processor files.
    // This option does not affect *.vue files.
    modules: false
  },
  // generate sourceMap for production build?
  productionSourceMap: false,

  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,

  // options for the PWA plugin.
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  // configure webpack-dev-server behavior
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8081,
    https: false,
    hotOnly: true,
    overlay: {
      warnings: true,
      errors: true
    },
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: {
      '/api': {
        target: 'http://192.168.193.41:8989',
        changeOrigin: true,
        // onProxyRes: function(proxyRes, req, res) {},
        pathRewrite: function(path) {
          return path.replace('/api/', '/')
        }
      },
      '/socket': {
        target: 'http://192.168.193.41:9015',
        changeOrigin: true,
        // onProxyRes: function(proxyRes, req, res) {},
        pathRewrite: function(path) {
          return path.replace('/socket/', '/')
        }
      },
      '/map_api': {
        target: 'http://192.168.193.41:8666',
        changeOrigin: true,
        // onProxyRes: function(proxyRes, req, res) {},
        pathRewrite: function(path) {
          return path.replace('/map_api/', '/')
        }
      }
    }, // string | Object
    before: app => {}
  },
  pluginOptions: {
    'style-resources-loader': {
      patterns: [
        '/Users/luxueyan/bitmain/data-tag-frontend/src/assets/scss/_vars.scss'
      ],
      preProcessor: 'scss'
    }
  }
}
