// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposal } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { ActionItem, InputAddress, Labelled, Static } from '@polkadot/react-components';
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
          <Labelled label={t('depositors')}>
            {seconds.map((address, index): React.ReactNode => (
              <InputAddress
                isDisabled
                key={`${index}:${address}`}
                defaultValue={address}
                withLabel={false}
              />
            ))}
          </Labelled>
          <Static label={t('balance')}>
            <FormatBalance value={balance} />
          </Static>
        </div>
      )}
    </ActionItem>
  );
}

export default translate(Proposal);
