import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'wordcount code',
  toolbar: 'wordcount',
  height: 600
});

export {};
