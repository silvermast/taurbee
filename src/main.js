import { getCurrentWindow } from '@tauri-apps/api/window';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import './polyfill.js';
import './styles.scss';
// import { initMenu } from './menu.js';
import { shortcuts } from './services/KeyboardShortcuts.js';
import App from './App.vue';

// initMenu(); // no need to await

shortcuts.closeWindow.register(() => {
  const tauriWindow = getCurrentWindow();
  tauriWindow.destroy();
});

// Vuetify
import '~/scss/vuetify-theme.scss';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const isDarkMode = globalThis.matchMedia?.(
  '(prefers-color-scheme: dark)'
).matches;
// console.log('THEME', getCurrentWindow().theme);

const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VRow: { dense: true },
    VBtn: { density: 'default', rounded: true },
  },
  icons: {
    iconfont: 'mdi', // https://pictogrammers.com/library/mdi/
  },
  theme: {
    defaultTheme: isDarkMode ? 'dark' : 'light',
  },
});

const pinia = createPinia();

createApp(App).use(pinia).use(vuetify).mount('#app');
