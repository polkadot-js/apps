import {
  BlockInfo,
  MetamaskPolkadotRpcRequest,
  SignPayloadJSONRequest, SignPayloadRawRequest,
  SnapConfig
} from "@nodefactory/metamask-polkadot-types";
import {SignerPayloadJSON, SignerPayloadRaw} from '@polkadot/types/types';
import {MetamaskPolkadotSnap} from "./snap";

async function sendSnapMethod(request: MetamaskPolkadotRpcRequest, pluginOrigin: string): Promise<unknown> {
  return await window.ethereum.send({
    method: pluginOrigin,
    params: [
      request
    ]
  });
}

async function sign(
  this: MetamaskPolkadotSnap,
  method: "signPayloadJSON" | "signPayloadRaw",
  payload: SignerPayloadJSON | SignerPayloadRaw
): Promise<{signature: string}> {
  return (
    await sendSnapMethod({
      method,
      params: {
        payload
      }
    } as SignPayloadJSONRequest | SignPayloadRawRequest,
    this.pluginOrigin
    )
  ) as {signature: string};
}

export async function signPayloadJSON(this: MetamaskPolkadotSnap, payload: SignerPayloadJSON): Promise<string> {
  return (await sign.bind(this)("signPayloadJSON", payload)).signature;
}

export async function signPayloadRaw(this: MetamaskPolkadotSnap, payload: SignerPayloadRaw): Promise<string> {
  return (await sign.bind(this)("signPayloadRaw", payload)).signature;
}

export async function addPolkadotAsset(this: MetamaskPolkadotSnap): Promise<void> {
  await sendSnapMethod({method: "addPolkadotAsset"}, this.pluginOrigin);
}

export async function getBalance(this: MetamaskPolkadotSnap): Promise<string> {
  return (await sendSnapMethod({method: "getBalance"}, this.pluginOrigin)) as string;
}

export async function getAddress(this: MetamaskPolkadotSnap): Promise<string> {
  return (await sendSnapMethod({method: "getAddress"}, this.pluginOrigin)) as string;
}

export async function getPublicKey(this: MetamaskPolkadotSnap): Promise<string> {
  return (await sendSnapMethod({method: "getPublicKey"}, this.pluginOrigin)) as string;
}

export async function exportSeed(this: MetamaskPolkadotSnap): Promise<string> {
  return (await sendSnapMethod({method: "exportSeed"}, this.pluginOrigin)) as string;
}

export async function setConfiguration(this: MetamaskPolkadotSnap, config: SnapConfig): Promise<void> {
  await sendSnapMethod({method: "configure", params: {configuration: config}}, this.pluginOrigin);
}

export async function getLatestBlock(this: MetamaskPolkadotSnap): Promise<BlockInfo> {
  try {
    return (
      await sendSnapMethod(
        {method: "getBlock", params: {blockTag: "latest"}},
        this.pluginOrigin)
    ) as BlockInfo;
  } catch (e) {
    console.log("Unable to fetch latest block", e);
    return {hash: "", number: ""};
  }
}

export async function getAllTransactions(this: MetamaskPolkadotSnap, address?: string): Promise<unknown> {
  return await sendSnapMethod({method: "getAllTransactions", params: {address}}, this.pluginOrigin);
}