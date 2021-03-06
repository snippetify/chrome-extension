# Snippetify Chrome Extension 

**Snippetify extension** auto detect snippets on any pages you visited and allow you to save it to [**Snippetify**](https://snippetify.com) for later use.

## What it does

This plugin allows you to save to [**Snippetify**](https://snippetify.com) any snippets on any websites in a breeze. It auto detects all the snippets available on the website and display the number and list them on the browser action, so when you click on one of them, it drives you directly to that snippet.

## How to use it

To use this plugin you can download it from [Chrome Web Store](https://chrome.google.com/webstore/detail/snippetify/lpmkkgnllkffcmmhidnahpnhjcbhepdk) or you can clone it and use it. 

For the second option follow these steps.

**NB:** You need Node.js installed.

#### Clone it

```bash
git clone https://github.com/snippetify/chrome-extension.git
```

#### Build it

```bash
npm install
npm run build
```

After building it you will find the add-on in the dist folder.

Load it to chrome ([chrome://extensions/](chrome://extensions/)) by selecting any file on the dist folder, and start using it.

## Changelog

Please see [CHANGELOG](https://github.com/snippetify/chrome-extension/blob/master/CHANGELOG.md) for more information what has changed recently.

## Testing

```bash
composer test
```

At this time any tests is available. We are working on it.

## Contributing

Please see [CONTRIBUTING](https://github.com/snippetify/chrome-extension/blob/master/CONTRIBUTING.md) for details.

## Credits

1. [Evens Pierre](https://github.com/pierrevensy)

## License

The MIT License (MIT). Please see [License File](https://github.com/snippetify/chrome-extension/blob/master/LICENSE.md) for more information.

