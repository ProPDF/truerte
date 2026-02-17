import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  theme: 'silver',
  skin_url: '../../../../../js/truerte/skins/ui/oxide',
  plugins: 'save code',
  toolbar: 'save code',
  height: 600
  // save_onsavecallback: () => { console.log('saved'); }
});

export {};
