import { RawEditorOptions, TrueRTE } from 'truerte/core/api/PublicApi';

declare let truerte: TrueRTE;

export default (): void => {

  const settings: RawEditorOptions = {
    selector: '.truerte',
    inline: true,
    content_css: '../../../../js/truerte/skins/content/default/content.css',
    images_upload_url: 'd',
    link_list: [
      { title: 'My page 1', value: 'http://www.truerte.com' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_list: [
      { title: 'My page 1', value: 'http://www.truerte.com' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_class_list: [
      { title: 'None', value: '' },
      { title: 'Some class', value: 'class-name' }
    ],
    templates: [
      { title: 'Some title 1', description: 'Some desc 1', content: 'My content' },
      { title: 'Some title 2', description: 'Some desc 2', content: '<div class="mceTmpl"><span class="cdate">cdate</span><span class="mdate">mdate</span>My content2</div>' }
    ],
    plugins: [
      'autosave', 'advlist', 'autolink', 'link', 'image', 'lists', 'charmap', 'preview', 'anchor', 'pagebreak',
      'searchreplace', 'wordcount', 'visualblocks', 'visualchars', 'code', 'fullscreen', 'insertdatetime', 'media', 'nonbreaking',
      'save', 'table', 'directionality', 'emoticons', 'template', 'codesample', 'help'
    ]
  };

  truerte.init(settings);
};
