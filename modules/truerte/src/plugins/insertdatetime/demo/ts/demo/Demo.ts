import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'insertdatetime code',
  toolbar: 'insertdatetime code',
  height: 600,
  menubar: 'insertdatetime',
  menu: {
    insertdatetime: { title: 'Insert Date/Time', items: 'insertdatetime' }
  }
});

export {};
