import { Strings, Type } from '@ephox/katamari';

export const setTruerteBaseUrl = (truerte: any, baseUrl: string): void => {
  const prefix = document.location.protocol + '//' + document.location.host;
  truerte.baseURL = baseUrl.indexOf('://') === -1 ? prefix + baseUrl : baseUrl;
  truerte.baseURI = new truerte.util.URI(truerte.baseURL);
};

export const detectTruerteBaseUrl = (settings: Record<string, any>): string =>
  Type.isString(settings.base_url) ? settings.base_url : '/project/node_modules/truerte';

export const setupTruerteBaseUrl = (truerte: any, settings: Record<string, any>): void => {
  if (Type.isString(settings.base_url)) {
    setTruerteBaseUrl(truerte, settings.base_url);
  } else if (!Type.isString(truerte.baseURL) || !Strings.contains(truerte.baseURL, '/project/')) {
    setTruerteBaseUrl(truerte, '/project/node_modules/truerte');
  }
};
