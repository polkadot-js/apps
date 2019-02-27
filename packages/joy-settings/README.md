# @polkadot/ui-settings

Manages app settings including endpoints, themes and prefixes

### Usage Example
User preferences are set as a settings object in the browser's local storage.
```
import settings from '@polkadot/ui-settings';

render () {
  // get api endpoint for the selected chain
  const WS_URL = settings.apiUrl();

  // get the selected il8n language
  const language = settings.il8nLang();

  // get all available il8n languages
  const languages = settings.availableLanguages();

  // update settings
  const updatedSettings = {
    ...settings,
    i18nLang: 'Arabic'
  }
  settings.set(updatedSettings);

  // NOTE: API currently does not handle hot reconnecting properly,
  so you need to manually reload the page after updating settings.
  window.location.reload();
}
```

### Used by
Apps that currently use the settings package
* [polkadot-js/apps]('https://www.github.com/polkadot-js/apps')
* [paritytech/substrate-light-ui](https://github.com/paritytech/substrate-light-ui)
