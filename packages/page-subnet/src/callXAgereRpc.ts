export async function callXAgereRpc(method: string, params: any[] = [], systemChain?: string): Promise<any> {
  let url = 'https://rpc-mainnet-1.geb.network';

  if (systemChain === 'GEB') {
    url = 'https://rpc-mainnet-1.geb.network';
  } else if (systemChain === 'GEB Signet'){
    url = 'https://signet.geb.network';
  }

  const body = JSON.stringify({
    jsonrpc: "2.0",
    method,
    params,
    id: 1
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body
  });

  const { result } = await response.json();
  return result;
}
