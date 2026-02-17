import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'directionality code lists',
  toolbar: 'ltr rtl code | bullist numlist',
  height: 600
});

export {};
