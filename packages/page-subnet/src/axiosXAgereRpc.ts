import axios from 'axios';

export async function axiosXAgereRpc(method: string, params: any, systemChain?: string): Promise<any> {
  let url = 'https://api.bevm.io';
  if (systemChain === 'GEB') {
    url = 'https://api.bevm.io';
  } else if (systemChain === 'GEB Signet') {
    url = 'https://api-pre.bevm.io';
  }

  try {
    if(!axios) return []
    const response =  await axios({
      method: 'GET',
      url: url.concat(method),
      headers: {
        'Content-Type': 'application/json',
      },
      params: params
    });

    return response.data.data;
  }catch (e) {
    console.error(e)
    return [];
  }

}
