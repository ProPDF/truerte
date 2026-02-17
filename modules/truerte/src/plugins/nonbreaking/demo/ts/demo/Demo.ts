import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  theme: 'silver',
  skin_url: '../../../../../js/truerte/skins/ui/oxide',
  plugins: 'nonbreaking code',
  toolbar: 'nonbreaking code',
  height: 600
});

export {};
