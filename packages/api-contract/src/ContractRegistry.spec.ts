// Copyright 2017-2020 @polkadot/types authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs';
import path from 'path';

import { TypeRegistry } from '@polkadot/types';

import ContractRegistry from './ContractRegistry';

import * as testContracts from '../test/contracts';

const abis: Record<string, any> = { ...testContracts };

function compare (name: string, registry: TypeRegistry): void {
  const inkRegistry = new ContractRegistry(registry, abis[name]);

  try {
    const cmpPath = path.join(__dirname, `../test/compare/${name}.test.json`);

    if (!fs.existsSync(cmpPath)) {
      fs.writeFileSync(cmpPath, JSON.stringify(inkRegistry.typeDefs, null, 2), { flag: 'w' });
    }

    expect(inkRegistry.typeDefs).toEqual(require(cmpPath));
  } catch (error) {
    console.error(JSON.stringify(inkRegistry.typeDefs));

    throw error;
  }
}

describe('ContractRegistry', (): void => {
  describe('construction', (): void => {
    const registry = new TypeRegistry();

    it('initializes from a contract ABI (flipper)', (): void => {
      compare('flipper', registry);
    });

    it('initializes from a contract ABI (incrementer)', (): void => {
      compare('incrementer', registry);
    });

    it('initializes from a contract ABI (erc20)', (): void => {
      compare('erc20', registry);
    });

    it('initializes from a contract ABI (dns)', (): void => {
      compare('dns', registry);
    });

    it('initializes from a contract ABI (erc721)', (): void => {
      compare('erc721', registry);
    });

    it('initializes from a contract ABI (multisig_plain)', (): void => {
      compare('multisigPlain', registry);
    });

    it('stores base project as JSON', (): void => {
      const inkRegistry = new ContractRegistry(registry, abis.dns);

      expect(inkRegistry.json).toEqual(abis.dns);
    });
  });
});
