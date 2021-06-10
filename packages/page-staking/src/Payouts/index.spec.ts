// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {ApiPromise} from '@polkadot/api';
import i18next from '@polkadot/react-components/i18n';
import {createAugmentedApi} from '@polkadot/test-support/api';
import {mockHooks} from '@polkadot/test-support/hooks/mockHooks';
import {MemoryStore} from '@polkadot/test-support/keyring';
import {keyring} from '@polkadot/ui-keyring';

import {PayoutsPage} from '../../test/pages/payoutsPage';

jest.mock('@polkadot/react-hooks/useTreasury', () => ({
  useTreasury: () => mockHooks.treasury
}));

jest.mock('@polkadot/react-hooks/useMembers', () => ({
  useMembers: () => mockHooks.members
}));

jest.mock('@polkadot/react-hooks/useBlockTime', () => ({
  useBlockTime: () => mockHooks.blockTime
}));

let augmentedApi: ApiPromise;

describe('Payouts', () => {
  let payoutsPage: PayoutsPage;

  beforeAll(async () => {
    await i18next.changeLanguage('en');
    keyring.loadAll({isDevelopment: true, store: new MemoryStore()});
    augmentedApi = createAugmentedApi();
  });

  beforeEach(() => {
    payoutsPage = new PayoutsPage(augmentedApi);
  });

  describe('empty view', () => {
    it('renders `My validators/stashes` toggle', async () => {
      payoutsPage.renderMany();

      await payoutsPage.expectText('My validators');
      await payoutsPage.expectText('My stashes');
    });

    it('when no own validators, then `My validators` is disabled and `My stashes` selected', async () => {
      payoutsPage.renderMany();

      await payoutsPage.expectMyValidators({isDisabled: true, isSelected: false});
    });

    it('when some own validators, then `My validators` is enabled and selected', async () => {
      payoutsPage.renderMany();

      await payoutsPage.expectMyValidators({isDisabled: false, isSelected: true});
    });

    it('when some own validators, but after accounts load and rerender, then `My validators` is selected',
      async () => {
        payoutsPage.renderMany();

        await payoutsPage.expectMyValidators({isDisabled: false, isSelected: true});
    });
  });
});
