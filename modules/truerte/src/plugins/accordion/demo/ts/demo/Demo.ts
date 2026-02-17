import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'table lists image accordion code',
  toolbar: 'table | numlist bullist | image | accordion | code',
  menu: { insert: { title: 'Insert', items: 'table | image | accordion' }},
  details_initial_state: 'inherited',
  details_serialize_state: 'inherited',
});

export {};
