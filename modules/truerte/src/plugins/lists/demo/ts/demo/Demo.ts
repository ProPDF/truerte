import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'lists code',
  toolbar: 'numlist bullist | outdent indent | code',
  height: 600,
  contextmenu: 'lists'
});

export {};
