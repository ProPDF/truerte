import { TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

export default (): void => {
  truerte.init({
    selector: '#editor',
    inline: true,
    fixed_toolbar_container: '#toolbar',
    plugins: 'template' // lets you check notification positioning
  });
};
