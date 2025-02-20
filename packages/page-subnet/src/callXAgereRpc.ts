export async function callXAgereRpc(method: string, params: any[] = [], systemChain?: string): Promise<any> {
  let url = 'https://rpc-mainnet-1.bevm.io';
  
  if (systemChain === 'BEVM Mainnet') {
    url = 'https://rpc-mainnet-1.bevm.io';
  } else if (systemChain === 'BEVM Testnet') {
    url = 'https://testnet.bevm.io';
  }else if (systemChain === 'Bevm Stack Testnet'){
    url = 'https://signet.bevm.io';
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
