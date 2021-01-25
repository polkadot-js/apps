// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { Bounty, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';

import { fireEvent, render } from '@testing-library/react';
import BN from 'bn.js';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { lightTheme } from '@polkadot/apps/themes';
import { POLKADOT_GENESIS } from '@polkadot/apps-config';
import { ApiContext } from '@polkadot/react-api';
import { ApiProps } from '@polkadot/react-api/types';
import i18next from '@polkadot/react-components/i18n';
import { QueueProvider } from '@polkadot/react-components/Status/Context';
import { QueueProps, QueueTxExtrinsicAdd } from '@polkadot/react-components/Status/types';
import { createAugmentedApi } from '@polkadot/test-support/api';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BountyFactory } from '@polkadot/test-support/creation/bounties/bountyFactory';
import { aliceSigner, MemoryStore } from '@polkadot/test-support/keyring';
import { TypeRegistry } from '@polkadot/types/create';
import { keyring } from '@polkadot/ui-keyring';

import { alice,
  bob,
  defaultAccounts,
  defaultBalance,
  defaultBountyApi,
  defaultMembers,
  defaultTreasury,
  ferdie } from '../test/hooks/defaults';
import Bounties from './Bounties';
import { BountyApi } from './hooks';

const mockMembers = defaultMembers;
const mockAccounts = defaultAccounts;
const mockTreasury = defaultTreasury;
let mockBountyApi = defaultBountyApi;
let mockBalance = defaultBalance;

jest.mock('./hooks', () => ({
  useBalance: () => mockBalance,
  useBounties: () => mockBountyApi
}));

jest.mock('@polkadot/react-hooks/useTreasury', () => ({
  useTreasury: () => mockTreasury
}));

jest.mock('@polkadot/react-hooks/useMembers', () => ({
  useMembers: () => mockMembers
}));

jest.mock('@polkadot/react-hooks/useAccounts', () => ({
  useAccounts: () => mockAccounts
}));

function aGenesisHash () {
  return new TypeRegistry().createType('Hash', POLKADOT_GENESIS);
}

function aProposal (extrinsic: SubmittableExtrinsic<'promise'>, ayes: string[] = [alice], nays: string[] = [bob]) {
  return {
    hash: new TypeRegistry().createType('Hash'),
    proposal: augmentedApi
      .registry.createType('Proposal', extrinsic),
    votes: augmentedApi.registry.createType('Votes', {
      ayes: ayes,
      index: 0,
      nays: nays,
      threshold: 4
    })
  };
}

const propose = jest.fn().mockReturnValue('mockProposeExtrinsic');

let augmentedApi: ApiPromise;
let queueExtrinsic: QueueTxExtrinsicAdd;
let aBountyStatus: (status: string) => BountyStatus;
let aBountyIndex: (index?:number) => BountyIndex;
let aBounty: ({ status, value }?: Partial<Bounty>) => Bounty;
let bountyWith: ({ status, value }: { status?: string, value?: number }) => Bounty;

describe('Bounties', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en');
    keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    augmentedApi = createAugmentedApi();
    ({ aBounty, aBountyIndex, aBountyStatus, bountyWith } = new BountyFactory(augmentedApi));
  });
  beforeEach(() => {
    queueExtrinsic = jest.fn() as QueueTxExtrinsicAdd;
  });

  const renderBounties = (bountyApi: Partial<BountyApi> = {}, { balance = 1 } = {}) => {
    mockBountyApi = { ...mockBountyApi, ...bountyApi };
    mockBalance = balanceOf(balance);
    const mockApi: ApiProps = {
      api: {
        derive: {
          accounts: { info: () => Promise.resolve(() => { /**/ }) }
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
  };

  function renderOneBounty (bounty: Bounty, proposals: DeriveCollectiveProposal[] = [], description = '', index = aBountyIndex()) {
    return renderBounties({ bounties: [{ bounty, description, index, proposals }] });
  }

  it('creates correct bounty with proposal', () => {
    const bounty = augmentedApi.registry.createType('Bounty', {
      curatorDeposit: new BN(1),
      status: 'Funded',
      value: new BN(10)
    });

    expect(bounty.curatorDeposit.eq(new BN(1))).toBeTruthy();
    expect(bounty.status.isFunded).toBeTruthy();
    expect(bounty.value.eq(new BN(10))).toBeTruthy();
  });

  it('creates correct proposal', () => {
    const proposal = augmentedApi.registry.createType('Proposal', augmentedApi.tx.bounties.proposeCurator(0, '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z', 1));

    expect(proposal.args[0].eq(new BN(0))).toBeTruthy();
    expect(proposal.args[1].toString()).toEqual('5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z');
    expect(proposal.args[2].eq(new BN(1))).toBeTruthy();
    expect(proposal.method).toEqual('proposeCurator');
  });

  it('creates correct votes', () => {
    const votes = augmentedApi.registry.createType('Votes', { ayes: ['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'], index: 0, nays: ['5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty'], threshold: 4 });

    expect(votes.ayes.length).toEqual(1);
    expect(votes.ayes[0].toString()).toEqual('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
    expect(votes.nays.length).toEqual(1);
    expect(votes.nays[0].toString()).toEqual('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty');
    expect(votes.index.toNumber()).toEqual(0);
    expect(votes.threshold.toNumber()).toEqual(4);
  });

  it('shows empty list when no bounties', async () => {
    const { findByText } = renderBounties();

    expect(await findByText('No open bounties')).toBeTruthy();
  });

  it('renders a bounty', async () => {
    const { findByText, queryAllByText } = renderOneBounty(aBounty(), [], 'kusama comic book');

    expect(await findByText('kusama comic book')).toBeTruthy();
    expect(queryAllByText('No open bounties')).toHaveLength(0);
  });

  it('renders bounties in order from newest to oldest', async () => {
    const bounty1 = bountyWith({ status: 'Proposed' });
    const bounty2 = bountyWith({ status: 'Proposed' });
    const bounty3 = bountyWith({ status: 'Proposed' });

    const { findAllByTestId } = renderBounties({ bounties: [
      { bounty: bounty1, description: 'bounty 2', index: aBountyIndex(2), proposals: [] },
      { bounty: bounty2, description: 'bounty 1', index: aBountyIndex(1), proposals: [] },
      { bounty: bounty3, description: 'bounty 3', index: aBountyIndex(3), proposals: [] }
    ] });

    const descriptions = await findAllByTestId('description');

    expect(descriptions[0].textContent).toEqual('bounty 3');
    expect(descriptions[1].textContent).toEqual('bounty 2');
    expect(descriptions[2].textContent).toEqual('bounty 1');
  });

  describe('create bounty modal', () => {
    it('validates bounty length', async () => {
      const { findByTestId, findByText } = renderBounties({ maximumReasonLength: 5 });

      const addBountyButton = await findByText('Add Bounty');

      fireEvent.click(addBountyButton);

      const titleInput = await findByTestId('bounty title');

      fireEvent.change(titleInput, { target: { value: 'longer than 5' } });

      expect(await findByText('Title too long')).toBeTruthy();
    });

    it('validates balance is enough for bond', async () => {
      const { findByTestId, findByText, queryByText } = renderBounties(
        { bountyDepositBase: new BN(10), dataDepositPerByte: new BN(1) },
        { balance: 10 }
      );

      const addBountyButton = await findByText('Add Bounty');

      fireEvent.click(addBountyButton);
      expect(await findByText('Description of the Bounty (to be stored on-chain)')).toBeTruthy(); // wait for load

      expect(queryByText('Account does not have enough funds.')).toBeFalsy();

      const titleInput = await findByTestId('bounty title');

      fireEvent.change(titleInput, { target: { value: 'add bytes' } });

      expect(await findByText('Account does not have enough funds.')).toBeTruthy();
    });
  });

  describe('propose curator modal', () => {
    it('shows an error if fee is greater than bounty value', async () => {
      const bounty = { status: aBountyStatus('Funded'), value: balanceOf(5) };
      const { findByTestId, findByText } = renderOneBounty(aBounty(bounty));

      const proposeCuratorButton = await findByText('Propose Curator');

      fireEvent.click(proposeCuratorButton);
      expect(await findByText('This action will create a Council motion to assign a Curator.')).toBeTruthy();

      const feeInput = await findByTestId("curator's fee");

      fireEvent.change(feeInput, { target: { value: '6' } });

      expect(await findByText("Curator's fee can't be higher than bounty value.")).toBeTruthy();
    });

    it('disables Assign Curator button if validation fails', async () => {
      const bounty = { status: aBountyStatus('Funded'), value: balanceOf(5) };
      const { findByTestId, findByText } = renderOneBounty(aBounty(bounty));

      const proposeCuratorButton = await findByText('Propose Curator');

      fireEvent.click(proposeCuratorButton);
      expect(await findByText('This action will create a Council motion to assign a Curator.')).toBeTruthy();

      const feeInput = await findByTestId("curator's fee");

      fireEvent.change(feeInput, { target: { value: '6' } });

      const assignCuratorButton = await findByText('Assign curator');

      expect(assignCuratorButton.classList.contains('isDisabled')).toBeTruthy();
    });

    it('queues propose extrinsic on submit', async () => {
      const bounty = { status: aBountyStatus('Funded') };
      const { findByTestId, findByText, getAllByRole } = renderOneBounty(aBounty(bounty));

      const proposeCuratorButton = await findByText('Propose Curator');

      fireEvent.click(proposeCuratorButton);
      expect(await findByText('This action will create a Council motion to assign a Curator.')).toBeTruthy();

      const feeInput = await findByTestId("curator's fee");

      fireEvent.change(feeInput, { target: { value: '0' } });

      const comboboxes = getAllByRole('combobox');

      const proposingAccountInput = comboboxes[0].children[0];
      const proposingCuratorInput = comboboxes[1].children[0];
      const alice = aliceSigner().address;

      fireEvent.change(proposingAccountInput, { target: { value: alice } });
      fireEvent.change(proposingCuratorInput, { target: { value: alice } });

      const assignCuratorButton = await findByText('Assign curator');

      fireEvent.click(assignCuratorButton);
      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: alice, extrinsic: 'mockProposeExtrinsic' }));
    });
  });

  describe('close bounty modal', () => {
    it('creates closeBounty proposal', async () => {
      const bounty = bountyWith({ status: 'Funded' });
      const { findByText, getByRole } = renderOneBounty(bounty);

      const closeButton = await findByText('Close');

      fireEvent.click(closeButton);
      expect(await findByText('This action will create a Council proposal to close the Bounty.')).toBeTruthy();

      const combobox = getByRole('combobox');
      const proposingAccountInput = combobox.children[0];

      fireEvent.change(proposingAccountInput, { target: { value: ferdie } });

      const closeBountyButton = getByRole('button', { name: 'Close Bounty' });

      fireEvent.click(closeBountyButton);
      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: ferdie, extrinsic: 'mockProposeExtrinsic' }));
    });

    it('Not available when close bounty motion already exists', async () => {
      const bounty = bountyWith({ status: 'Funded' });
      const proposals = [aProposal(augmentedApi.tx.bounties.closeBounty(0))];

      const { findByText } = renderOneBounty(bounty, proposals);

      await expect(findByText('Close')).rejects.toThrow();
    });
  });

  describe('extend bounty expiry action modal', () => {
    it('queues extend bounty expiry extrinsic on submit', async () => {
      const bounty = bountyWith({ status: 'Active' });

      const { findByTestId, findByText } = renderOneBounty(bounty);

      const extendBountyExpiryButton = await findByText('Extend Expiry');

      fireEvent.click(extendBountyExpiryButton);

      expect(await findByText('This action will extend expiry time of the selected bounty.')).toBeTruthy();

      const remarkInput = await findByTestId('bounty remark');

      fireEvent.change(remarkInput, { target: { value: 'The bounty extend expiry remark' } });

      const acceptButton = await findByText('Accept');

      fireEvent.click(acceptButton);
      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM', extrinsic: 'mockProposeExtrinsic' }));
      expect(mockBountyApi.extendBountyExpiry).toHaveBeenCalledWith(aBountyIndex(0), 'The bounty extend expiry remark');
    });
  });

  describe('status is extended', () => {
    it('on proposed curator', async () => {
      const bounty = bountyWith({ status: 'Funded' });
      const proposals = [aProposal(augmentedApi.tx.bounties.proposeCurator(0, '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z', 1))];

      const { findByText } = renderOneBounty(bounty, proposals);

      expect(await findByText('Curator under voting')).toBeTruthy();
    });

    it('on bounty approval in proposed status', async () => {
      const bounty = bountyWith({ status: 'Proposed' });
      const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0))];

      const { findByText } = renderOneBounty(bounty, proposals);

      expect(await findByText('Approval under voting')).toBeTruthy();
    });

    it('on parallel bounty approval and bounty close in proposed status', async () => {
      const bounty = bountyWith({ status: 'Proposed' });
      const proposals = [
        aProposal(augmentedApi.tx.bounties.closeBounty(0)),
        aProposal(augmentedApi.tx.bounties.approveBounty(0))
      ];

      const { findByText } = renderOneBounty(bounty, proposals);

      expect(await findByText('Approval under voting')).toBeTruthy();
    });

    it('on close bounty in active status', async () => {
      const bounty = bountyWith({ status: 'Active' });
      const proposals = [aProposal(augmentedApi.tx.bounties.closeBounty(0))];

      const { findByText } = renderOneBounty(bounty, proposals);

      expect(await findByText('Rejection under voting')).toBeTruthy();
    });

    it('on unassign curator in active state', async () => {
      const bounty = bountyWith({ status: 'Active' });
      const proposals = [aProposal(augmentedApi.tx.bounties.unassignCurator(0))];

      const { findByText } = renderOneBounty(bounty, proposals);

      expect(await findByText('Unassign curator under voting')).toBeTruthy();
    });

    it('on bounty approval in active state', async () => {
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

  describe('Proposed Curator extended status', () => {
    it('Funded and propose curator motion', async () => {
      const bounty = bountyWith({ status: 'Funded' });
      const proposals = [aProposal(augmentedApi.tx.bounties.proposeCurator(0, alice, 1))];

      const { findByText } = renderOneBounty(bounty, proposals);

      expect(await findByText('Proposed Curator')).toBeTruthy();
    });

    it('Funded and no propose curator motion', async () => {
      const bounty = bountyWith({ status: 'Funded' });

      const { findByText } = renderOneBounty(bounty);

      await expect(findByText('Proposed Curator')).rejects.toThrow();
    });

    it('CuratorProposed', async () => {
      const bounty = bountyWith({ status: 'CuratorProposed' });

      const { findByText } = renderOneBounty(bounty);

      await expect(findByText('Proposed Curator')).rejects.toThrow();
    });
  });

  describe('Voters', () => {
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

    it('multiple aye and no nay', async () => {
      const bounty = bountyWith({ status: 'Proposed' });
      const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0), [alice, bob], [])];

      const { findAllByTestId } = renderOneBounty(bounty, proposals);
      const ayeVoters = await findAllByTestId((testId) => testId.startsWith('voters_ayes'));

      expect(ayeVoters).toHaveLength(2);
      await expect(findAllByTestId((testId) => testId.startsWith('voters_nays'))).rejects.toThrow();
      expect(ayeVoters[0].getAttribute('data-testid')).toContain(alice);
      expect(ayeVoters[1].getAttribute('data-testid')).toContain(bob);
    });

    it('not displayed when no voting', async () => {
      const bounty = bountyWith({ status: 'Proposed' });
      const proposals: DeriveCollectiveProposal[] = [];

      const { findAllByTestId } = renderOneBounty(bounty, proposals);

      await expect(findAllByTestId((testId) => testId.startsWith('voters_ayes'))).rejects.toThrow();
      await expect(findAllByTestId((testId) => testId.startsWith('voters_nays'))).rejects.toThrow();
    });
  });

  describe('Voting summary', () => {
    it('is displayed when voting', async () => {
      const bounty = bountyWith({ status: 'Proposed' });
      const proposals = [aProposal(augmentedApi.tx.bounties.approveBounty(0), [alice, bob], [])];

      const { findByTestId } = renderOneBounty(bounty, proposals);

      expect((await findByTestId('voting-summary')).textContent).toEqual('Aye 2/4Nay 0/0Voting results');
    });

    it('is not displayed when no voting', async () => {
      const bounty = bountyWith({ status: 'Proposed' });
      const proposals: DeriveCollectiveProposal[] = [];

      const { findByTestId } = renderOneBounty(bounty, proposals);

      await expect(findByTestId('voting-summary')).rejects.toThrow();
    });
  });

  describe('Beneficiary description', () => {
    it('PendingPayout status', async () => {
      const bounty = bountyWith({ status: 'PendingPayout' });
      const proposals = [aProposal(augmentedApi.tx.bounties.awardBounty(0, '5EYCAe5ijiYfyeZ2JJCGq56LmPyNRAKzpG4QkoQkkQNB5e6Z'))];

      const { findByText } = renderOneBounty(bounty, proposals);

      expect(await findByText('Beneficiary')).toBeTruthy();
    });

    it('Other status', async () => {
      const bounty = bountyWith({ status: 'Active' });

      const { findByText } = renderOneBounty(bounty);

      await expect(findByText('Beneficiary')).rejects.toThrow();
    });
  });
});
