import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'codesample code',
  toolbar: 'codesample code',
  content_css: '../../../../../js/truerte/skins/content/default/content.css',
  height: 600
});

truerte.init({
  selector: 'div.truerte',
  inline: true,
  plugins: 'codesample code',
  toolbar: 'codesample code',
  content_css: '../../../../../js/truerte/skins/content/default/content.css',
  height: 600
});

export {};
