module.exports = {
   devServer: {
		disableHostCheck: true
	},
	chainWebpack: config => {
		config.plugin('html').tap(args => {
         args[0].title= '公布欄'
         return args
      });
		config.plugin('VuetifyLoaderPlugin').tap(args => [{
			match (originalTag, { kebabTag, camelTag, path, component }) {
			  if (kebabTag.startsWith('core-')) {
				 return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`]
			  }
			}
		}]);
		config.plugin('VuetifyLoaderPlugin').tap(args => [{
			progressiveImages: true
		}]);
		config.module.rules.delete('eslint');
	},
  "transpileDependencies": [
    "vuetify"
  ]
}