// Copyright 2017-2020 @canvas-ui/api-contract authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TypeRegistry } from '@polkadot/types';
import { TestContracts } from './types';

import InkAbi from './InkAbi';

import * as testContracts from '../test/contracts';

const abis: Record<TestContracts, any> = { ...testContracts };

function compare (name: TestContracts, registry: TypeRegistry, messageIds: string[]): void {
  try {
    const inkAbi = new InkAbi(registry, abis[name]);

    expect(inkAbi.messages.map(({ identifier }): string => identifier)).toEqual(messageIds);
  } catch (error) {
    console.error(error);

    throw error;
  }
}

describe('InkAbi', (): void => {
  describe('construction', (): void => {
    const registry = new TypeRegistry();

    it('initializes from a contract ABI (flipper)', (): void => {
      compare('flipper', registry, ['flip', 'get']);
    });

    it('initializes from a contract ABI (incrementer)', (): void => {
      compare('incrementer', registry, ['inc', 'get']);
    });

    it('initializes from a contract ABI (erc20)', (): void => {
      compare('erc20', registry, [
        'total_supply',
        'balance_of',
        'allowance',
        'transfer',
        'approve',
        'transfer_from'
      ]);
    });

    it('initializes from a contract ABI (delegator)', (): void => {
      compare('delegator', registry, [
        'get',
        'change',
        'switch'
      ]);
    });

    it('initializes from a contract ABI (dns)', (): void => {
      compare('dns', registry, [
        'register',
        'set_address',
        'transfer',
        'get_address'
      ]);
    });

    it('initializes from a contract ABI (erc721)', (): void => {
      compare('erc721', registry, [
        'balance_of',
        'owner_of',
        'get_approved',
        'is_approved_for_all',
        'set_approval_for_all',
        'approve',
        'transfer',
        'transfer_from',
        'mint',
        'burn'
      ]);
    });

    it('initializes from a contract ABI (multisig_plain)', (): void => {
      compare('multisigPlain', registry, [
        'add_owner',
        'remove_owner',
        'replace_owner',
        'change_requirement',
        'submit_transaction',
        'cancel_transaction',
        'confirm_transaction',
        'revoke_confirmation',
        'invoke_transaction',
        'eval_transaction'
      ]);
    });
  });
});
