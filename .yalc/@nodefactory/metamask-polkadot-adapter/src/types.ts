import {BlockInfo, PolkadotApi, SnapConfig, SnapRpcMethodRequest} from "@nodefactory/metamask-polkadot-types";
import {InjectedExtension} from "@polkadot/extension-inject/types";

export interface MetamaskSnapApi {
  addPolkadotAsset(): Promise<void>;
  getPublicKey(): Promise<string>;
  getBalance(): Promise<string>;
  exportSeed(): Promise<string>;
  getLatestBlock(): Promise<BlockInfo>;
  setConfiguration(configuration: SnapConfig): Promise<void>;
  getAllTransactions(address?: string): Promise<unknown>;
}

export interface InjectedMetamaskExtension extends InjectedExtension {
  getMetamaskSnapApi: () => Promise<MetamaskSnapApi>;
}

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      send: (request: SnapRpcMethodRequest | {method: string; params?: any[]}) => Promise<unknown>;
      on: (eventName: unknown, callback: unknown) => unknown;
      requestIndex: () => Promise<{getPluginApi: (origin: string) => Promise<PolkadotApi>}>;
    };
  }
}
