import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { TypeRegistry } from '@polkadot/types';
import {Api as ApiPromise} from '@cennznet/api';

describe('e2e transactions', () => {
  let api: ApiPromise;
  let alice: any, bob: any;
  const registry = new TypeRegistry();

  beforeAll(async () => {
    await cryptoWaitReady();

    const keyring = new Keyring({ type: 'sr25519' });
    alice = keyring.addFromUri('//Alice');
    bob = keyring.addFromUri('//Bob');

    api = await ApiPromise.create({
      provider: 'ws://localhost:9944',
      registry
    });
  });

  afterAll(() => {
    api.disconnect();
  });

  describe('Balance', () => {
    it('Check the transferred balance:', async done => {
      const CENNZ = 16000;
      const assetBalance = await api.query.genericAsset.freeBalance(CENNZ, alice.address);
      console.log("Alice's Balance for CENNZ", assetBalance.toString());

      const bobAssetBalance = await api.query.genericAsset.freeBalance(CENNZ, bob.address);
      console.log("Bob's Balance for CENNZ ", bobAssetBalance.toString());
      done();
    });
  });
});
