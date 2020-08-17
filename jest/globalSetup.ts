// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GenericContainer, Wait } from 'testcontainers';
import { SubstrateTestsGlobal } from './substrateTestsGlobal';

declare const global: SubstrateTestsGlobal;

const startSubstrate = async () => {
  console.log('Substrate container starting...');

  const startedTestContainer = await new GenericContainer('parity/substrate')
    .withName('polkadot-apps-test-substrate')
    .withExposedPorts(9944)
    .withCmd(['--dev', '--ws-port=9944', '--unsafe-ws-external'])
    .withWaitStrategy(Wait.forLogMessage('New epoch 0 launching'))
    .start();

  console.log('Done.');

  process.env.TEST_SUBSTRATE_PORT = startedTestContainer.getMappedPort(9944)?.toString() || '';
  global.__SUBSTRATE__ = startedTestContainer;
};

export default async (): Promise<void> => {
  await startSubstrate();
};
