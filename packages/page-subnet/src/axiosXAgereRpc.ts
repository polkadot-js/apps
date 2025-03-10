import axios from 'axios';

export async function axiosXAgereRpc(method: string, params: any, systemChain?: string): Promise<any> {
  let url = 'https://api.bevm.io';
  if (systemChain === 'BEVM Mainnet') {
    url = 'https://api.bevm.io';
  } else if (systemChain === 'BEVM Testnet') {
    url = 'https://api-pre.bevm.io';
  } else if (systemChain === 'Bevm Stack Testnet') {
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
