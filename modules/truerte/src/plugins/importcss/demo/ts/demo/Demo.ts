import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

const elm = document.querySelector('.truerte') as HTMLTextAreaElement;
elm.value = 'The format menu should show "red"';

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'importcss code',
  toolbar: 'styles code',
  height: 600,
  content_css: '../css/rules.css'
});

export {};
