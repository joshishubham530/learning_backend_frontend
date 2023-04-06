import {domainName} from './configuration.json';
export const CFetch = (url, token, data) => {
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };
  return fetch(domainName + url, options);
};

export const CFormFetch = (url, token, data) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: data,
  };
  return fetch(domainName + url, options);
};
export default null;
