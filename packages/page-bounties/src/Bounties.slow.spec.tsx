// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/react-components/i18n';

import type { SubmittableExtrinsic, SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { Bounty } from '@polkadot/types/interfaces';
import type { DeriveBounties } from '@polkadot/api-derive/types';
import type { KeyringPair } from '@polkadot/keyring/types';

import { waitFor } from '@testing-library/react';
import BN from 'bn.js';

import { ApiPromise } from '@polkadot/api/promise';
import { Keyring } from '@polkadot/keyring';
import { WsProvider } from '@polkadot/rpc-provider';
import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';

const SUBSTRATE_PORT = Number.parseInt(process.env.TEST_SUBSTRATE_PORT || '30333');

async function createApi (): Promise<ApiPromise> {
  process.env.NODE_ENV = 'test';

  // const provider = new WsProvider(`ws://127.0.0.1:${SUBSTRATE_PORT}`);
  const provider = new WsProvider('wss://kusama-rpc.polkadot.io');

  const api = await ApiPromise.create({ provider });

  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);

  console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

  return api;
}

describe('--SLOW--: Bounties list', () => {


  const tx = {

  };

  it('list bounties', async () => {
    const api = await createApi();
    const base = api.consts.treasury.bountyDepositBase;
    const perByte = api.consts.treasury.dataDepositPerByte;
    const entries: DeriveBounties = await api.derive.treasury.bounties()
    const bond = entries[0].bounty.bond
    console.log(`base = ${base.toBn().toString()}, perByte=${perByte.toBn().toString()}, bond=${bond.toBn().toString()}`);

    const keyring = new Keyring({ type: 'sr25519' });
    const aliceSigner = keyring.addFromUri('//Alice');

    await execute(api.tx.treasury.proposeBounty(new BN(500_000_000_000_000), 'new bounty hello hello more bytes'), aliceSigner);

    await waitFor(async () => {
      const bounties = await api.query.treasury.bounties.entries();

      const length = bounties.length;

      if (length === 0) throw new Error();
    }, { onTimeout: (error) => fail(error), timeout: 10000 });

    const bounties: DeriveBounties = await api.derive.treasury.bounties();

    expect(bounties[0].description).toEqual('new bounty hello hello more bytes');
  });
});

async function execute(extr: SubmittableExtrinsic<'promise'>, aliceSigner: KeyringPair) {
  const logger = { info: console.log };
  let currentTxDone = false;

  function sendStatusCb ({ events = [], status }: { events?: EventRecord[], status: ExtrinsicStatus; }) {
    if (status.isInvalid) {
      logger.info('Transaction invalid');
      currentTxDone = true;
    } else if (status.isReady) {
      logger.info('Transaction is ready');
    } else if (status.isBroadcast) {
      logger.info('Transaction has been broadcasted');
    } else if (status.isInBlock) {
      logger.info('Transaction is in block');
    } else if (status.isFinalized) {
      logger.info(`Transaction has been included in blockHash ${status.asFinalized.toHex()}`);
      events.forEach(
        ({ event }) => {
          if (event.method === 'ExtrinsicSuccess') {
            logger.info('Transaction succeeded');
          } else if (event.method === 'ExtrinsicFailed') {
            logger.info('Transaction failed');
          }
        }
      );
      currentTxDone = true;
    }
  }

  await extr.signAndSend(aliceSigner, sendStatusCb);
  await waitFor(() => expect(currentTxDone).toBeTruthy(), { timeout: 20000 });
}
