// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage } from '../types';

import React from 'react';

import { AddressMini, CallExpander, MarkError, MarkWarning } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  value?: Preimage;
}

function PreimageCall ({ className = '', value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <>
      <td className={`${className} all`}>
        {value && (
          value.proposal
            ? (
              <CallExpander
                labelHash={t<string>('call')}
                value={value.proposal}
              />
            )
            : (value.proposalError && (
              <MarkError content={value.proposalError} />
            )) || (value.proposalWarning && (
              <MarkWarning content={value.proposalWarning} />
            ))
        )}
      </td>
      <td className=''>
        {value?.deposit && (
          <AddressMini
            balance={value.deposit.amount}
            value={value.deposit.who}
            withBalance
          />
        )}
      </td>
    </>
  );
}

export default React.memo(PreimageCall);
