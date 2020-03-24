module.exports = {
  install: function install(Vue, options) {
    if (options === undefined) {
      options = {}
    }

    if (!options.disabled && (!options.key || options.key.length === 0)) {
      console.warn("Please enter a Zendesk Web Widget Key");
    }

    const disabledLogger = function(method, args) {
      console.log("Zendesk is disabled, you called:", method, args);
    };

    if (options.disabled) {
      window.zE = disabledLogger;
    }

    window.zESettings = options.settings;

    Vue._script = document.createElement("script");
    Vue._script.type = "text/javascript";
    Vue._script.async = true;
    Vue._script.id = "ze-snippet";
    Vue._script.src =
      "https://static.zdassets.com/ekr/snippet.js?key=" + options.key;

    Vue.load = function vueLoad() {
      delete window.zE;
      const first = document.getElementsByTagName("script")[0];
      first.parentNode.insertBefore(Vue._script, first);
    };

    Vue.mixin({
      created: function created() {
        if (!options.disabled) {
          Vue.load(options.key);
        }

        Vue._script.addEventListener("load", this.zendeskLoaded);
      },
      destroyed: function destroyed() {
        Vue._script.removeEventListener("load", this.zendeskLoaded);
      },
      methods: {
        zendeskLoaded: function zendeskLoaded(event) {
          this.$emit("zendeskLoaded", event);

          if (options.hideOnLoad) {
            Vue.hide();
          }
        }
      }
    });

    Vue.hide = function vueHide() { window.zE("webWidget", "hide") };
    Vue.show = function vueShow() { window.zE("webWidget", "show") };
    Vue.logout = function vueLogout() { window.zE("webWidget", "logout") };
    Vue.identify = function vueIdentify(user) { window.zE("webWidget", "identify", user)};
    Vue.prefill = function vuePrefill(user) { window.zE("webWidget", "prefill", user)};
    Vue.setLocale = function vueSetLocal(locale) { window.zE("webWidget", "setLocale", locale)};
    Vue.updateSettings = function vueUpdateSettings(settings) {
      window.zE("webWidget", "updateSettings", settings);
    }
    Vue.clear = function vueClear() { window.zE("webWidget", "clear") };
    Vue.updatePath = function vueUpdatePath(options) { window.zE("updatePath", "clear", options) };
    Vue.toggle = function vueToggle() { window.zE("webWidget", "toggle") };
    Vue.reset = function vueReset() { window.zE("webWidget", "reset") };
    Vue.close = function vueClose() { window.zE("webWidget", "close") };
    Vue.open = function vueOpen() { window.zE("webWidget", "open") };

    Object.defineProperty(Vue, "zE", {
      get() {
        return window.zE;
      }
    });

    Vue.prototype.$zendesk = Vue;
  }
};
