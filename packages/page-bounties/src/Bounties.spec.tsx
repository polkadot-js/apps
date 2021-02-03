// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { Bounty, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';
import type { BountyApi } from './hooks';

import { fireEvent, render } from '@testing-library/react';
import BN from 'bn.js';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { lightTheme } from '@polkadot/apps/themes';
import { ApiContext } from '@polkadot/react-api';
import { ApiProps } from '@polkadot/react-api/types';
import i18next from '@polkadot/react-components/i18n';
import { QueueProvider } from '@polkadot/react-components/Status/Context';
import { QueueProps, QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import { createAugmentedApi } from '@polkadot/test-support/api';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BountyFactory } from '@polkadot/test-support/creation/bounties/bountyFactory';
import { aGenesisHash } from '@polkadot/test-support/creation/hashes';
import { proposalFactory } from '@polkadot/test-support/creation/treasury/proposalFactory';
import { mockHooks } from '@polkadot/test-support/hooks/mockHooks';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { alice, bob } from '@polkadot/test-support/keyring/addresses';
import { keyring } from '@polkadot/ui-keyring';

import { defaultBountyUpdatePeriod, mockBountyHooks } from '../test/hooks/defaults';
import { BountiesPage } from '../test/pages/bountiesPage';
import { clickButtonWithName } from '../test/utils/clickButtonWithName';
import { clickElementWithTestId } from '../test/utils/clickElementWithTestId';
import { clickElementWithText } from '../test/utils/clickElementWithText';
import Bounties from './Bounties';
import { BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING } from './BountyInfos';

jest.mock('@polkadot/react-hooks/useTreasury', () => ({
  useTreasury: () => mockHooks.treasury
}));

jest.mock('@polkadot/react-hooks/useMembers', () => ({
  useMembers: () => mockHooks.members
}));

jest.mock('@polkadot/react-hooks/useBlockTime', () => ({
  useBlockTime: () => mockHooks.blockTime
}));

jest.mock('./hooks/useBalance', () => ({
  useBalance: () => mockBountyHooks.balance
}));

jest.mock('./hooks/useBounties', () => ({
  useBounties: () => mockBountyHooks.bountyApi
}));

let aProposal: (extrinsic: SubmittableExtrinsic<'promise'>, ayes?: string[], nays?: string[]) => DeriveCollectiveProposal;
let augmentedApi: ApiPromise;
let queueExtrinsic: QueueTxExtrinsicAdd;
let aBounty: ({ status, value }?: Partial<Bounty>) => Bounty;
let aBountyIndex: (index?:number) => BountyIndex;
let bountyStatusWith: ({ curator, status, updateDue }: { curator?: string, status?: string, updateDue?: number}) => BountyStatus;
let bountyWith: ({ status, value }: { status?: string, value?: number }) => Bounty;

const propose = jest.fn().mockReturnValue('mockProposeExtrinsic');

describe('Bounties', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en');
    keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    augmentedApi = createAugmentedApi();
    ({ aBounty, aBountyIndex, bountyStatusWith, bountyWith } = new BountyFactory(augmentedApi));
    ({ aProposal } = proposalFactory(augmentedApi));
  });

  beforeEach(() => {
    queueExtrinsic = jest.fn() as QueueTxExtrinsicAdd;
  });

  function renderBounties (bountyApi: Partial<BountyApi> = {}, { balance = 1 } = {}) {
    mockBountyHooks.bountyApi = { ...mockBountyHooks.bountyApi, ...bountyApi };
    mockBountyHooks.balance = balanceOf(balance);
    const mockApi: ApiProps = {
      api: {
        derive: {
          accounts: {
            info: () => Promise.resolve(() => { /**/
            })
          }
        },
        genesisHash: aGenesisHash(),
        query: {},
        registry: { chainDecimals: [12], chainTokens: ['Unit'] },
        tx: {
          council: {
            propose
          }
        }
      },
      systemName: 'substrate'
    } as unknown as ApiProps;

    const queue = {
      queueExtrinsic
    } as QueueProps;

    return render(
      <Suspense fallback='...'>
        <QueueProvider value={queue}>
          <MemoryRouter>
            <ThemeProvider theme={lightTheme}>
              <ApiContext.Provider value={mockApi}>
                <Bounties/>
              </ApiContext.Provider>
            </ThemeProvider>
          </MemoryRouter>
        </QueueProvider>
      </Suspense>
    );
  }

  function renderOneBounty (bounty: Bounty, proposals: DeriveCollectiveProposal[] = [], description = '', index = aBountyIndex()) {
    return renderBounties({ bounties: [{ bounty, description, index, proposals }] });
  }

  describe('list', () => {
    it('shows message when no bounties', async () => {
      const { findByText } = renderBounties();

      expect(await findByText('No open bounties')).toBeTruthy();
    });

    it('renders a bounty', async () => {
      const { findByText, queryAllByText } = renderOneBounty(aBounty(), [], 'kusama comic book');

      expect(await findByText('kusama comic book')).toBeTruthy();
      expect(queryAllByText('No open bounties')).toHaveLength(0);
    });

    it('renders bounties in order from newest to oldest', async () => {
      const { findAllByTestId } = renderBounties({
        bounties: [
          { bounty: aBounty(), description: 'bounty 2', index: aBountyIndex(2), proposals: [] },
          { bounty: aBounty(), description: 'bounty 1', index: aBountyIndex(1), proposals: [] },
          { bounty: aBounty(), description: 'bounty 3', index: aBountyIndex(3), proposals: [] }
        ]
      });

      const descriptions = await findAllByTestId('description');

      expect(descriptions[0].textContent).toEqual('bounty 3');
      expect(descriptions[1].textContent).toEqual('bounty 2');
      expect(descriptions[2].textContent).toEqual('bounty 1');
    });
  });

  describe('bounty in a list', () => {
    describe('has extended status', () => {
      it('when voting on proposed curator', async () => {
        const bounty = bountyWith({ status: 'Funded' });
        const proposals = [aProposal(augmentedApi.tx.bounties.proposeCurator(0, '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z', 1))];

        const { findByText } = renderOneBounty(bounty, proposals);

        expect(await findByText('Curator under voting')).toBeTruthy();
      });

      it('when voting on bounty approval', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0))];

        const { findByText } = renderOneBounty(bounty, proposals);

        expect(await findByText('Bounty approval under voting')).toBeTruthy();
      });

      it('when simultaneous close and approve motions exist, show approved', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals = [
          aProposal(augmentedApi.tx.bounties.closeBounty(0)),
          aProposal(augmentedApi.tx.bounties.approveBounty(0))
        ];

        const { findByText } = renderOneBounty(bounty, proposals);

        expect(await findByText('Bounty approval under voting')).toBeTruthy();
      });

      it('when voting on close bounty', async () => {
        const bounty = bountyWith({ status: 'Active' });
        const proposals = [aProposal(augmentedApi.tx.bounties.closeBounty(0))];

        const { findByText } = renderOneBounty(bounty, proposals);

        expect(await findByText('Bounty rejection under voting')).toBeTruthy();
      });

      it('when voting on unassign curator', async () => {
        const bounty = bountyWith({ status: 'Active' });
        const proposals = [aProposal(augmentedApi.tx.bounties.unassignCurator(0))];

        const { findByText } = renderOneBounty(bounty, proposals);

        expect(await findByText('Curator slash under voting')).toBeTruthy();
      });

      it('when a motion exists that would fail on execution, show nothing', async () => {
        const bounty = bountyWith({ status: 'Active' });
        const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0))];

        const { findByTestId } = renderOneBounty(bounty, proposals);

        await expect(findByTestId('extendedVotingStatus')).rejects.toThrow();
      });

      it('when bounty is claimable', async () => {
        const bounty = bountyWith({ status: 'PendingPayout' });
        const { findByTestId } = renderOneBounty(bounty);

        expect((await findByTestId('extendedActionStatus')).textContent).toEqual('Claimable');
      });
    });

    describe('has extended description for Curator', () => {
      it('when propose curator motion is voted and bounty is in Funded state', async () => {
        const bounty = bountyWith({ status: 'Funded' });
        const proposals = [aProposal(augmentedApi.tx.bounties.proposeCurator(0, alice, 1))];

        const { findByText } = renderOneBounty(bounty, proposals);

        expect(await findByText('Proposed Curator')).toBeTruthy();
      });

      it('when bounty is in Funded status, but there is no motion, show nothing', async () => {
        const bounty = bountyWith({ status: 'Funded' });

        const { findByText } = renderOneBounty(bounty);

        await expect(findByText('Proposed Curator')).rejects.toThrow();
      });

      it('when status is different, show nothing', async () => {
        const bounty = bountyWith({ status: 'CuratorProposed' });

        const { findByText } = renderOneBounty(bounty);

        await expect(findByText('Proposed Curator')).rejects.toThrow();
      });
    });

    describe('has Beneficiary description', () => {
      it('in PendingPayout status', async () => {
        const bounty = bountyWith({ status: 'PendingPayout' });
        const proposals = [aProposal(augmentedApi.tx.bounties.awardBounty(0, '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z'))];

        const { findByText } = renderOneBounty(bounty, proposals);

        expect(await findByText('Beneficiary')).toBeTruthy();
      });

      it('not in other status', async () => {
        const bounty = bountyWith({ status: 'Active' });

        const { findByText } = renderOneBounty(bounty);

        await expect(findByText('Beneficiary')).rejects.toThrow();
      });
    });

    describe('has voting summary', () => {
      it('is displayed when voting', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0), [alice, bob], [])];

        const { findByTestId } = renderOneBounty(bounty, proposals);

        expect((await findByTestId('voting-summary')).textContent).toEqual('Aye 2/4Nay 0/0Voting results');
      });

      it('is not displayed when not voting', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals: DeriveCollectiveProposal[] = [];

        const { findByTestId } = renderOneBounty(bounty, proposals);

        await expect(findByTestId('voting-summary')).rejects.toThrow();
      });
    });

    describe('has voters', () => {
      it('aye and nay', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0))];
        const { findAllByTestId } = renderOneBounty(bounty, proposals);
        const ayeVoters = await findAllByTestId((testId) => testId.startsWith('voters_ayes'));
        const nayVoters = await findAllByTestId((testId) => testId.startsWith('voters_nays'));

        expect(ayeVoters).toHaveLength(1);
        expect(nayVoters).toHaveLength(1);
        expect(ayeVoters[0].getAttribute('data-testid')).toContain(alice);
        expect(nayVoters[0].getAttribute('data-testid')).toContain(bob);
      });

      it('multiple ayes and no nay', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0), [alice, bob], [])];

        const { findAllByTestId } = renderOneBounty(bounty, proposals);
        const ayeVoters = await findAllByTestId((testId) => testId.startsWith('voters_ayes'));

        expect(ayeVoters).toHaveLength(2);
        await expect(findAllByTestId((testId) => testId.startsWith('voters_nays'))).rejects.toThrow();
        expect(ayeVoters[0].getAttribute('data-testid')).toContain(alice);
        expect(ayeVoters[1].getAttribute('data-testid')).toContain(bob);
      });

      it('no voters when no voting', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals: DeriveCollectiveProposal[] = [];

        const { findAllByTestId } = renderOneBounty(bounty, proposals);

        await expect(findAllByTestId((testId) => testId.startsWith('voters_ayes'))).rejects.toThrow();
        await expect(findAllByTestId((testId) => testId.startsWith('voters_nays'))).rejects.toThrow();
      });
    });
  });

  describe('create bounty modal', () => {
    it('validates bounty length', async () => {
      const { findByRole, findByTestId, findByText } = renderBounties({ maximumReasonLength: 5 });

      await clickButtonWithName('Add Bounty', findByRole);

      const titleInput = await findByTestId('bounty title');

      fireEvent.change(titleInput, { target: { value: 'longer than 5' } });

      expect(await findByText('Title too long')).toBeTruthy();
    });

    it('validates balance is enough for bond', async () => {
      const { findByRole, findByTestId, findByText, queryByText } = renderBounties(
        { bountyDepositBase: new BN(10), dataDepositPerByte: new BN(1) },
        { balance: 10 }
      );

      await clickButtonWithName('Add Bounty', findByRole);

      expect(await findByText('Description of the Bounty (to be stored on-chain)')).toBeTruthy(); // wait for load

      expect(queryByText('Account does not have enough funds.')).toBeFalsy();

      const titleInput = await findByTestId('bounty title');

      fireEvent.change(titleInput, { target: { value: 'add bytes' } });

      expect(await findByText('Account does not have enough funds.')).toBeTruthy();
    });
  });

  describe('propose curator modal', () => {
    let bountiesPage: BountiesPage;

    beforeEach(async () => {
      bountiesPage = new BountiesPage(augmentedApi);
      bountiesPage.renderOne(bountyWith({ status: 'Funded', value: 5 }));

      await bountiesPage.openProposeCurator();
    });

    it('shows an error if fee is greater than bounty value', async () => {
      await bountiesPage.enterCuratorsFee('6');

      await bountiesPage.expectText("Curator's fee can't be higher than bounty value.");
    });

    it('disables Assign Curator button if validation fails', async () => {
      await bountiesPage.enterCuratorsFee('6');

      expect(await bountiesPage.assignCuratorButton()).toHaveClass('isDisabled');
    });

    it('queues propose extrinsic on submit', async () => {
      await bountiesPage.enterCuratorsFee('0');
      bountiesPage.enterProposingAccount(alice);
      bountiesPage.enterProposedCurator(alice);

      fireEvent.click(await bountiesPage.assignCuratorButton());
      bountiesPage.expectExtrinsicQueued({ accountId: alice, extrinsic: 'mockProposeExtrinsic' });
    });
  });

  describe('close bounty modal', () => {
    let bountiesPage: BountiesPage;

    beforeEach(() => {
      bountiesPage = new BountiesPage(augmentedApi);
    });

    it('creates closeBounty proposal', async () => {
      const { findByRole, findByTestId, findByText } = bountiesPage.renderOne(bountyWith({ status: 'Funded' }));

      await clickElementWithTestId('extra-actions', findByTestId);

      await clickElementWithText('Close', findByText);

      await bountiesPage.expectText('This action will create a Council proposal to close the Bounty.');

      bountiesPage.enterProposingAccount(alice);

      await clickButtonWithName('Close Bounty', findByRole);

      bountiesPage.expectExtrinsicQueued({ accountId: alice, extrinsic: 'mockProposeExtrinsic' });
      expect(mockBountyHooks.bountyApi.closeBounty).toHaveBeenCalledWith(aBountyIndex(0));
    });

    it('is not available when close bounty motion already exists', async () => {
      const bounty = bountyWith({ status: 'Funded' });
      const proposals = [aProposal(augmentedApi.tx.bounties.closeBounty(0))];

      const { findByTestId } = renderOneBounty(bounty, proposals);

      await expect(findByTestId('extra-actions')).rejects.toThrow();
    });
  });

  describe('Reject curator modal', () => {
    it('creates extrinsic', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: bob, status: 'CuratorProposed' }) });

      const { findByRole, findByTestId, findByText } = renderOneBounty(bounty);

      await clickElementWithTestId('extra-actions', findByTestId);

      await clickElementWithText('Reject Curator', findByText);

      await clickButtonWithName('Reject', findByRole);

      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: bob }));
    });

    it('shows options for all roles', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: bob, status: 'Active' }) });

      const { findByTestId, findByText } = renderOneBounty(bounty);

      await clickElementWithTestId('extra-actions', findByTestId);

      expect(await findByText('Give Up')).toBeTruthy();
      expect(await findByText('Slash Curator (Council)')).toBeTruthy();
    });
  });

  describe('Accept curator modal', () => {
    it('creates extrinsic', async () => {
      const bounty = aBounty({ fee: balanceOf(20), status: bountyStatusWith({ curator: bob, status: 'CuratorProposed' }) });

      const { findByRole, findByTestId, findByText } = renderOneBounty(bounty);

      await clickButtonWithName('Accept', findByRole);

      expect(await findByText('This action will accept your candidacy for the curator of the bounty.')).toBeTruthy();

      const fee = (await findByTestId("curator's fee")).getAttribute('value');

      expect(fee).toEqual('20.0000');

      const deposit = (await findByTestId("curator's deposit")).getAttribute('value');

      expect(deposit).toEqual('10.0000');

      await clickButtonWithName('Accept Curator Role', findByRole);

      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: bob }));
      expect(mockBountyHooks.bountyApi.acceptCurator).toHaveBeenCalledWith(aBountyIndex(0));
    });
  });

  describe('extend bounty expiry action modal', () => {
    it('queues extend bounty expiry extrinsic on submit', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: alice }) });

      const { findByRole, findByTestId, findByText } = renderOneBounty(bounty);

      await clickElementWithTestId('extra-actions', findByTestId);

      await clickElementWithText('Extend Expiry', findByText);

      expect(await findByText('This action will extend expiry time of the selected bounty.')).toBeTruthy();

      const remarkInput = await findByTestId('bounty remark');

      fireEvent.change(remarkInput, { target: { value: 'The bounty extend expiry remark' } });

      await clickButtonWithName('Accept', findByRole);

      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: alice, extrinsic: 'mockExtendExtrinsic' }));
      expect(mockBountyHooks.bountyApi.extendBountyExpiry).toHaveBeenCalledWith(aBountyIndex(0), 'The bounty extend expiry remark');
    });
  });

  describe('slash curator modal', () => {
    let bountiesPage: BountiesPage;

    beforeEach(() => {
      bountiesPage = new BountiesPage(augmentedApi);
    });

    it('gives up on the Curator role of an Active bounty', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: alice }) });
      const { findByRole, findByTestId, findByText } = bountiesPage.renderOne(bounty);

      await clickElementWithTestId('extra-actions', findByTestId);

      await clickElementWithText('Give Up', findByText);

      await bountiesPage.expectText('This action will unassign you from a curator role.');

      bountiesPage.enterProposingAccount(alice);

      await clickButtonWithName('Approve', findByRole);

      bountiesPage.expectExtrinsicQueued({ accountId: alice, extrinsic: 'mockUnassignExtrinsic' });
      expect(mockBountyHooks.bountyApi.unassignCurator).toHaveBeenCalledWith(aBountyIndex(0));
    });

    it('creates a motion when slashing a PendingPayout bounty', async () => {
      const { findByRole, findByTestId, findByText } = bountiesPage.renderOne(bountyWith({ status: 'PendingPayout' }));

      await clickElementWithTestId('extra-actions', findByTestId);

      await clickElementWithText('Slash Curator (Council)', findByText);

      await bountiesPage.expectText('This action will create a Council motion to slash the Curator.');

      bountiesPage.enterProposingAccount(alice);

      await clickButtonWithName('Approve', findByRole);

      bountiesPage.expectExtrinsicQueued({ accountId: alice, extrinsic: 'mockProposeExtrinsic' });
    });
  });

  describe('award beneficiary action modal', () => {
    it('awards the beneficiary ', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: alice }) });
      const { findByRole, findByText, getAllByRole } = renderOneBounty(bounty);

      await clickButtonWithName('Award Beneficiary', findByRole);

      expect(await findByText('This action will award the Beneficiary and close the bounty after a delay.')).toBeTruthy();
      const comboboxes = getAllByRole('combobox');

      const beneficiaryAccountInput = comboboxes[1].children[0];

      fireEvent.change(beneficiaryAccountInput, { target: { value: bob } });
      fireEvent.keyDown(beneficiaryAccountInput, { code: 'Enter', key: 'Enter' });

      await clickButtonWithName('Approve', findByRole);

      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: alice, extrinsic: 'mockAwardExtrinsic' }));
      expect(mockBountyHooks.bountyApi.awardBounty).toHaveBeenCalledWith(aBountyIndex(0), bob);
    });
  });

  describe('Show', () => {
    it('warning when update time is close', async () => {
      const bounty = aBounty({ status: bountyStatusWith(
        {
          curator: alice,
          status: 'Active',
          updateDue: defaultBountyUpdatePeriod.muln(BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING).divn(100).toNumber() - 1
        }) });

      const { findByText } = renderOneBounty(bounty);

      expect(await findByText('Warning')).toBeTruthy();
      expect(await findByText('Close deadline')).toBeTruthy();
    });

    it('info when waiting for bounty funding', async () => {
      const bounty = bountyWith({ status: 'Approved' });
      const { findByText } = renderOneBounty(bounty);

      expect(await findByText('Info')).toBeTruthy();
      expect(await findByText('Waiting for Bounty Funding')).toBeTruthy();
    });

    it('info when waiting for curator acceptance', async () => {
      const bounty = bountyWith({ status: 'CuratorProposed' });
      const { findByText } = renderOneBounty(bounty);

      expect(await findByText('Info')).toBeTruthy();
      expect(await findByText("Waiting for Curator's acceptance")).toBeTruthy();
    });

    it('no warning or info when requirements are not met', async () => {
      const bounty = aBounty({ status: bountyStatusWith({
        curator: alice,
        status: 'Active',
        updateDue: defaultBountyUpdatePeriod.muln(BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING).divn(100).toNumber() + 1
      }) });

      const { findByText } = renderOneBounty(bounty);

      await expect(findByText('Warning')).rejects.toThrow();
      await expect(findByText('Close deadline')).rejects.toThrow();

      await expect(findByText('Info')).rejects.toThrow();
      await expect(findByText('Waiting for Bounty Funding')).rejects.toThrow();
      await expect(findByText("Waiting for Curator's acceptance")).rejects.toThrow();
    });
  });
});
