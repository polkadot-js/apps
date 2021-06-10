// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import i18next from '@polkadot/react-components/i18n';
import {mockHooks} from '@polkadot/test-support/hooks/mockHooks';
import {MemoryStore} from '@polkadot/test-support/keyring';
import {keyring} from '@polkadot/ui-keyring';

import {PayoutsPage} from '../../test/pages/payoutsPage';
import {StakerState} from "@polkadot/react-hooks/types";

jest.mock('@polkadot/react-hooks/useTreasury', () => ({
  useTreasury: () => mockHooks.treasury
}));

jest.mock('@polkadot/react-hooks/useMembers', () => ({
  useMembers: () => mockHooks.members
}));

jest.mock('@polkadot/react-hooks/useBlockTime', () => ({
  useBlockTime: () => mockHooks.blockTime
}));

describe('Payouts', () => {
  let payoutsPage: PayoutsPage;
  const someOwnedValidator: StakerState = {
    controllerId: 'someId',
    hexSessionIdNext: '0x1112',
    hexSessionIdQueue: 'sth',
    isLoading: false,
    isOwnController: false,
    isOwnStash: false,
    isStashNominating: false,
    isStashValidating: false,
    sessionIds: [],
    stashId: 'someStashId'
  }

  beforeAll(async () => {
    await i18next.changeLanguage('en');
    keyring.loadAll({isDevelopment: true, store: new MemoryStore()});
  });

  beforeEach(() => {
    payoutsPage = new PayoutsPage();
  });

  describe('empty view', () => {
    it('renders `My validators/stashes` toggle', async () => {
      payoutsPage.renderPage();

      await payoutsPage.expectText('My validators');
      await payoutsPage.expectText('My stashes');
    });

    it('when no own validators, then `My validators` is disabled and `My stashes` selected', async () => {
      payoutsPage.renderPage();

      await payoutsPage.expectMyValidators({isDisabled: true, isSelected: false});
    });

    it('when some own validators, then `My validators` is enabled and selected', async () => {
      payoutsPage.renderPage([someOwnedValidator]);

      await payoutsPage.expectMyValidators({isDisabled: false, isSelected: true});
    });

    it('when some own validators, but after accounts load and rerender, then `My validators` is selected',
      async () => {
        payoutsPage.renderPage();
        await payoutsPage.expectMyValidators({isDisabled: true, isSelected: false});
        payoutsPage.renderPage([someOwnedValidator])
        await payoutsPage.expectMyValidators({isDisabled: false, isSelected: true});
      });
  });
});
