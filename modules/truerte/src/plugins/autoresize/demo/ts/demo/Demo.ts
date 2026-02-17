import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  theme: 'silver',
  plugins: 'autoresize code',
  toolbar: 'autoresize code',
  height: 600
});

export {};
