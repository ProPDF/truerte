import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'fullscreen code',
  toolbar: 'fullscreen code',
  height: 600,
  fullscreen_native: true
});

truerte.init({
  selector: 'textarea.truerte2',
  plugins: 'fullscreen code',
  toolbar: 'fullscreen code',
  height: 600
});

export {};
