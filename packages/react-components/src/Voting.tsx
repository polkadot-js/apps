// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Proposal } from '@polkadot/types/interfaces';
import { I18nProps, TxModalProps, TxTriggerProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import { withMulti } from '@polkadot/react-api';

import translate from './translate';
import Button from './Button';
import Dropdown from './Dropdown';
import ProposedAction from './ProposedAction';
import TxModalNew from './TxModalNew';
import { isTreasuryProposalVote } from './util';

interface Props extends I18nProps, TxModalProps {
  allAccounts?: SubjectInfo;
  hash?: string;
  idNumber: BN | number;
  isCouncil: boolean;
  proposal?: Proposal | null;
}

function getTx ({ isCouncil, idNumber, hash }: Props, voteValue: boolean): [string, any[]] {
  return [
    isCouncil ? 'council.vote' : 'democracy.vote',
    isCouncil
      ? [hash, idNumber, voteValue]
      : [idNumber, voteValue]
  ];
}

function Voting (props: Props): React.ReactElement<Props> {
  const { t, hash, idNumber, isCouncil, proposal } = props;

  const [voteValue, setVoteValue] = useState(false);

  const [txMethod, txParams] = useMemo(
    (): [string, any[]] => getTx(props, voteValue),
    [hash, idNumber, isCouncil, voteValue]
  );

  const voteOptions = [
    { text: t('Aye, I approve'), value: true },
    { text: t('Nay, I do not approve'), value: false }
  ];

  const _onChangeVote = (voteValue: boolean): void => {
    setVoteValue(voteValue);
  };

  return (
    <TxModalNew
      trigger={
        ({ onOpen }): React.ReactElement => (
          <div className='ui--Row-buttons'>
            <Button
              isPrimary
              label={t('Vote')}
              icon='check'
              onClick={onOpen}
            />
          </div>
        )
      }
      header={t(isCouncil ? 'Vote on council proposal' : 'Vote on proposal')}
      preContent={
        (): React.ReactElement => ((
          <>
            <ProposedAction
              expandNested={isTreasuryProposalVote(proposal)}
              idNumber={idNumber}
              isCollapsible
              proposal={proposal}
            />
            <br />
            <br />
          </>
        ))
      }
      inputAddressLabel={t('vote with account')}
      inputAddressHelp={t('Select the account you wish to vote with. You can approve "aye" or deny "nay" the proposal.')}
      content={
        (): React.ReactElement => ((
          <Dropdown
            help={t('Select your vote preferences for this proposal, either to approve or disapprove')}
            label={t('record my vote as')}
            options={voteOptions}
            onChange={_onChangeVote}
            value={voteValue}
          />
        ))
      }
      tx={txMethod}
      params={txParams}
    />
  );
}

export default withMulti(
  Voting,
  translate
);
