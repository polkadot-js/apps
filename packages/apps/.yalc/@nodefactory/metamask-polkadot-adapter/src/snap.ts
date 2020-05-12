import {Injected, InjectedAccount, InjectedAccounts} from "@polkadot/extension-inject/types";
import {Signer as InjectedSigner, SignerResult} from '@polkadot/api/types';
import {SignerPayloadJSON, SignerPayloadRaw} from '@polkadot/types/types';
import {
  addPolkadotAsset,
  exportSeed,
  getAddress,
  getAllTransactions,
  getBalance,
  getLatestBlock,
  getPublicKey,
  setConfiguration,
  signPayloadJSON,
  signPayloadRaw
} from "./methods";
import {SnapConfig} from "@nodefactory/metamask-polkadot-types";
import {MetamaskSnapApi} from "./types";
import {isPolkadotSnapInstalled} from "./utils";

export class MetamaskPolkadotSnap implements Injected {

  public accounts: InjectedAccounts = {
    get: async () => {
      const account: InjectedAccount = {
        address: await getAddress.bind(this)(),
        genesisHash: null,
        name: "Metamask account"
      };
      return [account];
    },
    subscribe: () => {
      return (): void => {
        throw "unsupported method";
      };
    }
  };

  public signer: InjectedSigner = {
    signPayload: async (payload: SignerPayloadJSON): Promise<SignerResult> => {
      const signature = await signPayloadJSON.bind(this)(payload);
      const id = this.requestCounter;
      this.requestCounter += 1;
      return {id, signature};
    },
    signRaw: async (raw: SignerPayloadRaw): Promise<SignerResult> => {
      const signature = await signPayloadRaw.bind(this)(raw);
      const id = this.requestCounter;
      this.requestCounter += 1;
      return {id, signature};
    },
    update: () => null
  };

  protected readonly config: SnapConfig;
  protected readonly pluginOrigin: string;
  
  private requestCounter: number;

  public constructor(pluginOrigin: string, config: SnapConfig) {
    this.pluginOrigin = pluginOrigin;
    this.config = config || {networkName: "westend"};
    this.requestCounter = 0;
  }

  public enableSnap = async (): Promise<Injected> => {
    if(!(await isPolkadotSnapInstalled(this.pluginOrigin))) {
      await window.ethereum.send({
        method: "wallet_enable",
        params: [{
          [this.pluginOrigin]: {}
        }]
      });
      await setConfiguration.bind(this)(this.config);
      await addPolkadotAsset.bind(this)();
    }
    return this;
  };

  public getMetamaskSnapApi = async (): Promise<MetamaskSnapApi> => {
    return {
      addPolkadotAsset: addPolkadotAsset.bind(this),
      exportSeed: exportSeed.bind(this),
      getAllTransactions: getAllTransactions.bind(this),
      getBalance: getBalance.bind(this),
      getLatestBlock: getLatestBlock.bind(this),
      getPublicKey: getPublicKey.bind(this),
      setConfiguration: setConfiguration.bind(this)
    };
  };
}