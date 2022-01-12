// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyIndex, BountyStatus } from '@polkadot/types/interfaces';
import type { PalletBountiesBounty } from '@polkadot/types/lookup';

import { fireEvent } from '@testing-library/react';

import { ApiPromise } from '@polkadot/api';
import i18next from '@polkadot/react-components/i18n';
import { createAugmentedApi } from '@polkadot/test-support/api';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BountyFactory } from '@polkadot/test-support/creation/bounties/bountyFactory';
import { proposalFactory } from '@polkadot/test-support/creation/treasury/proposalFactory';
import { mockHooks } from '@polkadot/test-support/hooks/mockHooks';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { alice, bob } from '@polkadot/test-support/keyring/addresses';
import { keyring } from '@polkadot/ui-keyring';
import { BN } from '@polkadot/util';

import { defaultBountyUpdatePeriod, mockBountyHooks } from '../test/hooks/defaults';
import { BountiesPage } from '../test/pages/bountiesPage';
import { BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING } from './BountyNextActionInfo/BountyActionMessage';

jest.mock('@polkadot/react-hooks/useTreasury', () => ({
  useTreasury: () => mockHooks.treasury
}));

jest.mock('@polkadot/react-hooks/useCollectiveInstance', () => ({
  useCollectiveInstance: () => 'council'
}));

jest.mock('@polkadot/react-hooks/useCollectiveMembers', () => ({
  useCollectiveMembers: () => mockHooks.members
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
let aBounty: ({ status, value }?: Partial<PalletBountiesBounty>) => PalletBountiesBounty;
let aBountyIndex: (index?: number) => BountyIndex;
let bountyStatusWith: ({ curator, status, updateDue }: { curator?: string, status?: string, updateDue?: number}) => BountyStatus;
let bountyWith: ({ status, value }: { status?: string, value?: number }) => PalletBountiesBounty;

describe('Bounties', () => {
  let bountiesPage: BountiesPage;

  beforeAll(async () => {
    await i18next.changeLanguage('en');
    keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    augmentedApi = createAugmentedApi();
    ({ aBounty, aBountyIndex, bountyStatusWith, bountyWith } = new BountyFactory(augmentedApi));
    ({ aProposal } = proposalFactory(augmentedApi));
  });

  beforeEach(() => {
    bountiesPage = new BountiesPage(augmentedApi);
  });

  describe('list', () => {
    it('shows message when no bounties', async () => {
      bountiesPage.renderMany();

      await bountiesPage.expectText('No open bounties');
    });

    it('renders a bounty', async () => {
      bountiesPage.renderOne(aBounty(), [], 'kusama comic book');

      await bountiesPage.expectText('kusama comic book');
      bountiesPage.expectTextAbsent('No open bounties');
    });

    it('renders bounties in order from newest to oldest', async () => {
      bountiesPage.renderMany({
        bounties: [
          { bounty: aBounty(), description: 'bounty 2', index: aBountyIndex(2), proposals: [] },
          { bounty: aBounty(), description: 'bounty 1', index: aBountyIndex(1), proposals: [] },
          { bounty: aBounty(), description: 'bounty 3', index: aBountyIndex(3), proposals: [] }
        ]
      });

      expect(await bountiesPage.findAllDescriptions()).toEqual(['bounty 3', 'bounty 2', 'bounty 1']);
    });
  });

  describe('bounty in a list', () => {
    describe('has extended status', () => {
      it('when voting on proposed curator', async () => {
        const bounty = bountyWith({ status: 'Funded' });
        const proposals = [aProposal(augmentedApi.tx.bounties.proposeCurator(0, '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z', 1))];

        bountiesPage.renderOne(bounty, proposals);

        await bountiesPage.expectVotingDescription('Curator proposal under voting');
      });

      it('when voting on bounty approval', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0))];

        bountiesPage.renderOne(bounty, proposals);

        await bountiesPage.expectVotingDescription('Bounty approval under voting');
      });

      it('when simultaneous close and approve motions exist, show approved', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals = [
          aProposal(augmentedApi.tx.bounties.closeBounty(0)),
          aProposal(augmentedApi.tx.bounties.approveBounty(0))
        ];

        bountiesPage.renderOne(bounty, proposals);

        await bountiesPage.expectVotingDescription('Bounty approval under voting');
      });

      it('when voting on close bounty', async () => {
        const bounty = bountyWith({ status: 'Active' });
        const proposals = [aProposal(augmentedApi.tx.bounties.closeBounty(0))];

        bountiesPage.renderOne(bounty, proposals);

        await bountiesPage.expectVotingDescription('Bounty rejection under voting');
      });

      it('when voting on unassign curator', async () => {
        const bounty = bountyWith({ status: 'Active' });
        const proposals = [aProposal(augmentedApi.tx.bounties.unassignCurator(0))];

        bountiesPage.renderOne(bounty, proposals);

        await bountiesPage.expectVotingDescription('Curator slash under voting');
      });

      it('when a motion exists that would fail on execution, show nothing', async () => {
        const bounty = bountyWith({ status: 'Active' });
        const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0))];

        const { findByTestId } = bountiesPage.renderOne(bounty, proposals);

        await expect(findByTestId('voting-description')).rejects.toThrow();
      });
    });

    describe('has extended description for Curator', () => {
      it('when propose curator motion is voted and bounty is in Funded state', async () => {
        const bounty = bountyWith({ status: 'Funded' });
        const proposals = [aProposal(augmentedApi.tx.bounties.proposeCurator(0, alice, 1))];

        bountiesPage.renderOne(bounty, proposals);

        await bountiesPage.expectText('Proposed Curator');
      });

      it('when bounty is in Funded status, but there is no motion, show nothing', async () => {
        const bounty = bountyWith({ status: 'Funded' });

        bountiesPage.renderOne(bounty);

        await bountiesPage.rendered();
        bountiesPage.expectTextAbsent('Proposed Curator');
      });

      it('when status is different, show nothing', async () => {
        const bounty = bountyWith({ status: 'CuratorProposed' });

        bountiesPage.renderOne(bounty);

        await bountiesPage.rendered();
        bountiesPage.expectTextAbsent('Proposed Curator');
      });
    });

    describe('has Beneficiary description', () => {
      it('in PendingPayout status', async () => {
        const bounty = bountyWith({ status: 'PendingPayout' });
        const proposals = [aProposal(augmentedApi.tx.bounties.awardBounty(0, '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z'))];

        bountiesPage.renderOne(bounty, proposals);

        await bountiesPage.expectText('Beneficiary');
      });

      it('not in other status', async () => {
        const bounty = bountyWith({ status: 'Active' });

        bountiesPage.renderOne(bounty);

        await bountiesPage.rendered();
        bountiesPage.expectTextAbsent('Beneficiary');
      });
    });

    describe('has voting summary', () => {
      it('is displayed when voting', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0), [alice, bob], [])];

        const { findByTestId } = bountiesPage.renderOne(bounty, proposals);

        expect((await findByTestId('voting-summary')).textContent).toEqual('Aye 2/4Nay 0/0Voting');
      });

      it('is not displayed when not voting', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals: DeriveCollectiveProposal[] = [];

        const { findByTestId } = bountiesPage.renderOne(bounty, proposals);

        await expect(findByTestId('voting-summary')).rejects.toThrow();
      });
    });

    describe('has voters', () => {
      it('aye and nay', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0))];
        const { findAllByTestId } = bountiesPage.renderOne(bounty, proposals);
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

        const { findAllByTestId } = bountiesPage.renderOne(bounty, proposals);
        const ayeVoters = await findAllByTestId((testId) => testId.startsWith('voters_ayes'));

        expect(ayeVoters).toHaveLength(2);
        await expect(findAllByTestId((testId) => testId.startsWith('voters_nays'))).rejects.toThrow();
        expect(ayeVoters[0].getAttribute('data-testid')).toContain(alice);
        expect(ayeVoters[1].getAttribute('data-testid')).toContain(bob);
      });

      it('no voters when no voting', async () => {
        const bounty = bountyWith({ status: 'Proposed' });
        const proposals: DeriveCollectiveProposal[] = [];

        const { findAllByTestId } = bountiesPage.renderOne(bounty, proposals);

        await expect(findAllByTestId((testId) => testId.startsWith('voters_ayes'))).rejects.toThrow();
        await expect(findAllByTestId((testId) => testId.startsWith('voters_nays'))).rejects.toThrow();
      });
    });
  });

  describe('create bounty modal', () => {
    it('validates bounty length', async () => {
      bountiesPage.renderMany({ maximumReasonLength: 5 });

      await bountiesPage.openAddBounty();
      await bountiesPage.enterBountyTitle('longer than 5');

      await bountiesPage.expectText('Title too long');
    });

    it('validates balance is enough for bond', async () => {
      bountiesPage.renderMany(
        { bountyDepositBase: new BN(10), dataDepositPerByte: new BN(1) },
        { balance: 10 }
      );

      await bountiesPage.openAddBounty();
      bountiesPage.expectTextAbsent('Account does not have enough funds.');
      await bountiesPage.enterBountyTitle('add bytes');

      await bountiesPage.expectText('Account does not have enough funds.');
    });
  });

  describe('propose curator modal', () => {
    beforeEach(async () => {
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
    it('creates closeBounty proposal', async () => {
      bountiesPage.renderOne(bountyWith({ status: 'Funded' }));
      await bountiesPage.openCloseBounty();

      bountiesPage.enterProposingAccount(alice);
      await bountiesPage.clickButton('Close Bounty');

      bountiesPage.expectExtrinsicQueued({ accountId: alice, extrinsic: 'mockProposeExtrinsic' });
      expect(mockBountyHooks.bountyApi.closeBounty).toHaveBeenCalledWith(aBountyIndex(0));
    });

    it('is not available when close bounty motion already exists', async () => {
      const bounty = bountyWith({ status: 'Funded' });
      const proposals = [aProposal(augmentedApi.tx.bounties.closeBounty(0))];

      const { findByTestId } = bountiesPage.renderOne(bounty, proposals);

      await expect(findByTestId('extra-actions')).rejects.toThrow();
    });
  });

  describe('Reject curator modal', () => {
    it('creates extrinsic', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: bob, status: 'CuratorProposed' }) });

      bountiesPage.renderOne(bounty);

      await bountiesPage.openRejectCuratorRole();

      await bountiesPage.clickButton('Reject');

      bountiesPage.expectExtrinsicQueued({ accountId: bob });
    });

    it('shows options for all roles', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: bob, status: 'Active' }) });

      bountiesPage.renderOne(bounty);

      await bountiesPage.openExtraActions();

      await bountiesPage.expectText('Give up');
      await bountiesPage.expectText('Slash curator (Council)');
    });
  });

  describe('Accept curator modal', () => {
    it('creates extrinsic', async () => {
      const bounty = aBounty({
        fee: balanceOf(20),
        status: bountyStatusWith({ curator: bob, status: 'CuratorProposed' })
      });

      bountiesPage.renderOne(bounty);
      await bountiesPage.openAcceptCuratorRole();

      expect(await bountiesPage.findCuratorsFee()).toEqual('20.0000');
      expect(await bountiesPage.findCuratorsDeposit()).toEqual('10.0000');

      await bountiesPage.clickButton('Accept Curator Role');

      bountiesPage.expectExtrinsicQueued({ accountId: bob });
      expect(mockBountyHooks.bountyApi.acceptCurator).toHaveBeenCalledWith(aBountyIndex(0));
    });
  });

  describe('extend bounty expiry action modal', () => {
    it('queues extend bounty expiry extrinsic on submit', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: alice }) });

      bountiesPage.renderOne(bounty);
      await bountiesPage.openExtendExpiry();

      await bountiesPage.enterExpiryRemark('The bounty extend expiry remark');
      await bountiesPage.clickButton('Accept');

      bountiesPage.expectExtrinsicQueued({ accountId: alice, extrinsic: 'mockExtendExtrinsic' });
      expect(mockBountyHooks.bountyApi.extendBountyExpiry).toHaveBeenCalledWith(aBountyIndex(0), 'The bounty extend expiry remark');
    });
  });

  describe('give up curator modal', () => {
    it('gives up on the Curator role of an Active bounty', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: alice }) });

      bountiesPage.renderOne(bounty);
      await bountiesPage.openGiveUpCuratorsRole();

      bountiesPage.enterProposingAccount(alice);
      await bountiesPage.clickButton('Give up');

      bountiesPage.expectExtrinsicQueued({ accountId: alice, extrinsic: 'mockUnassignExtrinsic' });
      expect(mockBountyHooks.bountyApi.unassignCurator).toHaveBeenCalledWith(aBountyIndex(0));
    });
  });

  describe('slash curator modal', () => {
    it('creates a motion when slashing a PendingPayout bounty', async () => {
      bountiesPage.renderOne(bountyWith({ status: 'PendingPayout' }));

      await bountiesPage.openSlashCuratorByCouncil();

      bountiesPage.enterProposingAccount(alice);

      await bountiesPage.clickButton('Approve');

      bountiesPage.expectExtrinsicQueued({ accountId: alice, extrinsic: 'mockProposeExtrinsic' });
    });
  });

  describe('award beneficiary action modal', () => {
    it('awards the beneficiary ', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: alice }) });

      bountiesPage.renderOne(bounty);

      await bountiesPage.openAwardBeneficiary();
      bountiesPage.enterBeneficiary(bob);
      await bountiesPage.clickButton('Approve');

      bountiesPage.expectExtrinsicQueued({ accountId: alice, extrinsic: 'mockAwardExtrinsic' });
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

      bountiesPage.renderOne(bounty);

      await bountiesPage.expectText('Close deadline');
    });

    it('warning when update time is overdue', async () => {
      const bounty = aBounty({ status: bountyStatusWith(
        {
          curator: alice,
          status: 'Active',
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          updateDue: mockBountyHooks.bountyApi.bestNumber!.toNumber()
        }) });

      bountiesPage.renderOne(bounty);

      await bountiesPage.expectText('Update overdue');
    });

    it('info when waiting for bounty funding', async () => {
      const bounty = bountyWith({ status: 'Approved' });

      bountiesPage.renderOne(bounty);

      await bountiesPage.expectText('Waiting for Bounty Funding');
    });

    it('info when waiting for curator acceptance', async () => {
      const bounty = bountyWith({ status: 'CuratorProposed' });

      bountiesPage.renderOne(bounty);

      await bountiesPage.expectText('Waiting for Curator\'s acceptance');
    });

    it('info when bounty is claimable', async () => {
      const bounty = bountyWith({ status: 'PendingPayout' });

      bountiesPage.renderOne(bounty);

      await bountiesPage.expectText('Waiting for implementer to claim');
    });

    it('no warning or info when requirements are not met', async () => {
      const bounty = aBounty({ status: bountyStatusWith({
        curator: alice,
        status: 'Active',
        updateDue: defaultBountyUpdatePeriod.muln(BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING).divn(100).toNumber() + 1
      }) });

      bountiesPage.renderOne(bounty);
      await bountiesPage.rendered();

      bountiesPage.expectTextAbsent('Close deadline');
      bountiesPage.expectTextAbsent('Update overdue');
      bountiesPage.expectTextAbsent('Waiting for Bounty Funding');
      bountiesPage.expectTextAbsent("Waiting for Curator's acceptance");
      bountiesPage.expectTextAbsent('Waiting for implementer to claim');
    });
  });
});
