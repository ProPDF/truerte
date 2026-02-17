import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'autolink code',
  toolbar: 'autolink code',
  height: 600
});

export {};
