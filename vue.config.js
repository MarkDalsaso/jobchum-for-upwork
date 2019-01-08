module.exports = {
  pages: {
    'popup/popup': {
      entry: 'src/popup/popup.js',
      title: 'Popup'
    }
  },
  pluginOptions: {
    browserExtension: {
      registry: undefined,
      components: {
        background: true,
        popup: true,
        contentScripts: true
      },
      api: 'browser',
      usePolyfill: true,
      autoImportPolyfill: true,
      componentOptions: {
        background: {
          entry: 'src/background.js'
        },
        contentScripts: {
          entries: {
            'content_scripts/content-script': [
              'src/content_scripts/content-script.js'
            ]
          }
        }
      }
    }
  }
}
