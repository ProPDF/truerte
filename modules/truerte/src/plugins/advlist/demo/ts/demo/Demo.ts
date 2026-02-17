import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'lists advlist code',
  toolbar: 'bullist numlist | outdent indent | code',
  height: 600
});

export {};
