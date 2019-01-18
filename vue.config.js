module.exports = {
   //publicPath: 
    // process.env.NODE_ENV === 'production'
    //   ? '/production-sub-path/'
    //   : '/',
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
                  'content_scripts/x1': ['src/content_scripts/xhrCs.js'],
                  'content_scripts/x2': ['src/content_scripts/xhrInjection.js']
               }
            }
         }
      }
   }
};
