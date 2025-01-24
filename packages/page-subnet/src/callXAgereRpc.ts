export async function callXAgereRpc(method: string, params: any[] = []): Promise<any> {
  const url = 'https://signet.bevm.io';  // RPC 服务器的 URL

  const body = JSON.stringify({
    jsonrpc: "2.0",
    method: method,
    params: params,
    id: 1
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body
  });

  const { result } = await response.json();
  return result;
}
