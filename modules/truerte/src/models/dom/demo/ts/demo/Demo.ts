import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'div.truerte',
  setup: (ed) => {
    ed.on('init', () => {
      const runtimeModel = ed.model;
      // eslint-disable-next-line no-console
      console.log('demo model created', runtimeModel);
    });
  }
});
