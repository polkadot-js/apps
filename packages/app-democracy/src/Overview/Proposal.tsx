// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposal } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { ActionItem, InputAddress, Static } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import translate from '../translate';
import Seconding from './Seconding';

interface Props extends I18nProps {
  value: DeriveProposal;
}

function Proposal ({ className, t, value: { balance, index, proposal, seconds } }: Props): React.ReactElement<Props> {
  return (
    <ActionItem
      className={className}
      idNumber={index}
      proposal={proposal}
    >
      <Seconding
        depositors={seconds || []}
        proposalId={index}
      />
      {balance && seconds && (
        <div>
          {seconds.map((address, count): React.ReactNode => (
            <InputAddress
              isDisabled
              label={count === 0 ? t('proposer') : t('depositor {{count}}', { replace: { count } })}
              key={`${count}:${address}`}
              defaultValue={address}
            />
          ))}
          <Static label={t('balance')}>
            <FormatBalance value={balance} />
          </Static>
        </div>
      )}
    </ActionItem>
  );
}

export default translate(Proposal);
