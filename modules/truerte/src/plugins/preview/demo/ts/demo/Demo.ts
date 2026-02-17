import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  theme: 'silver',
  skin_url: '../../../../../js/truerte/skins/ui/oxide',
  plugins: 'preview code',
  toolbar: 'preview code',
  height: 600
});

export {};
