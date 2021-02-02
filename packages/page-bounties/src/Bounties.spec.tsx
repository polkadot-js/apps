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
import { MemoryStore } from '@polkadot/test-support/keyring';
import { TypeRegistry } from '@polkadot/types/create';
import { keyring } from '@polkadot/ui-keyring';
import { extractTime } from '@polkadot/util';

import { BLOCKS_PERCENTAGE_LEFT_TO_SHOW_WARNING } from '../src/BountyInfos';
import { alice,
  bob,
  defaultBalance,
  defaultBountyApi,
  defaultBountyUpdatePeriod,
  defaultMembers,
  defaultTreasury } from '../test/hooks/defaults';
import { clickButtonWithName } from '../test/utils/clickButtonWithName';
import { clickElementWithTestId } from '../test/utils/clickElementWithTestId';
import { clickElementWithText } from '../test/utils/clickElementWithText';
import Bounties from './Bounties';
import { BountyApi } from './hooks';

const mockMembers = defaultMembers;
const mockTreasury = defaultTreasury;
let mockBountyApi = defaultBountyApi;
let mockBalance = defaultBalance;

const mockBlockTime = [50, '', extractTime(1)];

jest.mock('./hooks/useBalance', () => ({
  useBalance: () => mockBalance
}));

jest.mock('./hooks/useBounties', () => ({
  useBounties: () => mockBountyApi
}));

jest.mock('@polkadot/react-hooks/useTreasury', () => ({
  useTreasury: () => mockTreasury
}));

jest.mock('@polkadot/react-hooks/useMembers', () => ({
  useMembers: () => mockMembers
}));

jest.mock('@polkadot/react-hooks/useBlockTime', () => ({
  useBlockTime: () => mockBlockTime
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
let aBounty: ({ fee, status, value }?: Partial<Bounty>) => Bounty;
let bountyWith: ({ status, value }: { status?: string, value?: number }) => Bounty;
let bountyStatusWith: ({ curator, status, updateDue }: { curator?: string, status?: string, updateDue?: number}) => BountyStatus;

describe('Bounties', () => {
  beforeAll(async () => {
    await i18next.changeLanguage('en');
    keyring.loadAll({ isDevelopment: true, store: new MemoryStore() });
    augmentedApi = createAugmentedApi();
    ({ aBounty, aBountyIndex, aBountyStatus, bountyStatusWith, bountyWith } = new BountyFactory(augmentedApi));
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
      const { findByRole, findByTestId, findByText, getByRole } = renderOneBounty(bounty);

      await clickElementWithTestId('extra-actions', findByTestId);

      await clickElementWithText('Close', findByText);

      expect(await findByText('This action will create a Council proposal to close the Bounty.')).toBeTruthy();

      const combobox = getByRole('combobox');
      const proposingAccountInput = combobox.children[0];

      fireEvent.change(proposingAccountInput, { target: { value: alice } });
      fireEvent.keyDown(proposingAccountInput, { code: 'Enter', key: 'Enter' });

      await clickButtonWithName('Close Bounty', findByRole);

      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: alice, extrinsic: 'mockProposeExtrinsic' }));
      expect(mockBountyApi.closeBounty).toHaveBeenCalledWith(aBountyIndex(0));
    });

    it('Not available when close bounty motion already exists', async () => {
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
      expect(mockBountyApi.acceptCurator).toHaveBeenCalledWith(aBountyIndex(0));
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
      expect(mockBountyApi.extendBountyExpiry).toHaveBeenCalledWith(aBountyIndex(0), 'The bounty extend expiry remark');
    });
  });

  describe('slash curator action modal', () => {
    it('give up on a Curator function in Active state bounty', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: alice }) });
      const { findByRole, findByTestId, findByText, getAllByRole } = renderOneBounty(bounty);

      await clickElementWithTestId('extra-actions', findByTestId);

      await clickElementWithText('Give Up', findByText);

      expect(await findByText('This action will unassign you from a curator role.')).toBeTruthy();

      const comboboxes = getAllByRole('combobox');

      const proposingAccountInput = comboboxes[0].children[0];

      fireEvent.change(proposingAccountInput, { target: { value: alice } });

      await clickButtonWithName('Approve', findByRole);

      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: alice, extrinsic: 'mockUnassignExtrinsic' }));
      expect(mockBountyApi.unassignCurator).toHaveBeenCalledWith(aBountyIndex(0));
    });

    it('for bounty in PendingPayout state', async () => {
      const bounty = bountyWith({ status: 'PendingPayout' });

      const { findByRole, findByTestId, findByText, getAllByRole } = renderOneBounty(bounty);

      await clickElementWithTestId('extra-actions', findByTestId);

      await clickElementWithText('Slash Curator (Council)', findByText);

      expect(await findByText('This action will create a Council motion to slash the Curator.')).toBeTruthy();

      const comboboxes = getAllByRole('combobox');

      const proposingAccountInput = comboboxes[0].children[0];

      fireEvent.change(proposingAccountInput, { target: { value: alice } });
      fireEvent.keyDown(proposingAccountInput, { code: 'Enter', key: 'Enter' });

      await clickButtonWithName('Approve', findByRole);

      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: alice, extrinsic: 'mockProposeExtrinsic' }));
    });
  });

  describe('award beneficiary action modal', () => {
    it('awards the beneficiary ', async () => {
      const bounty = aBounty({ status: bountyStatusWith({ curator: alice }) });
      const { findByText, getAllByRole } = renderOneBounty(bounty);

      const awardBeneficiaryButton = await findByText('Award Beneficiary');

      fireEvent.click(awardBeneficiaryButton);
      expect(await findByText('This action will award the Beneficiary and close the bounty after a delay.')).toBeTruthy();
      const comboboxes = getAllByRole('combobox');

      const beneficiaryAccountInput = comboboxes[1].children[0];

      fireEvent.change(beneficiaryAccountInput, { target: { value: bob } });
      fireEvent.keyDown(beneficiaryAccountInput, { code: 'Enter', key: 'Enter' });

      const acceptButton = await findByText('Approve');

      fireEvent.click(acceptButton);

      expect(queueExtrinsic).toHaveBeenCalledWith(expect.objectContaining({ accountId: alice, extrinsic: 'mockAwardExtrinsic' }));
      expect(mockBountyApi.awardBounty).toHaveBeenCalledWith(aBountyIndex(0), bob);
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
      const proposals = [aProposal(augmentedApi.tx.bounties.awardBounty(0, alice))];

      const { findByText } = renderOneBounty(bounty, proposals);

      expect(await findByText('Beneficiary')).toBeTruthy();
    });

    it('Other status', async () => {
      const bounty = bountyWith({ status: 'Active' });

      const { findByText } = renderOneBounty(bounty);

      await expect(findByText('Beneficiary')).rejects.toThrow();
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
