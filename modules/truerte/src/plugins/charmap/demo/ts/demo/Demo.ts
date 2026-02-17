import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

truerte.init({
  selector: 'textarea.truerte',
  plugins: 'charmap',
  toolbar: 'charmap',
  height: 600,
  charmap_append: [[ 'A'.charCodeAt(0), 'A' ], [ 'B'.charCodeAt(0), 'B' ], [ 'C'.charCodeAt(0), 'C' ], [ 0x1d160, 'note' ]]
});

export {};
