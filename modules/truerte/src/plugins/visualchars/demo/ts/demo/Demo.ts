import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'visualchars code',
  toolbar: 'visualchars code',
  visualchars_default_state: true,
  skin_url: '../../../../../js/truerte/skins/ui/oxide',
  height: 600
});

export {};
