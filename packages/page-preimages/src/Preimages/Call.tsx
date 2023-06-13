// Copyright 2017-2023 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Preimage } from '@polkadot/react-hooks/types';

import React from 'react';

import { AddressMini, MarkError, MarkWarning } from '@polkadot/react-components';
import { ZERO_ACCOUNT } from '@polkadot/react-hooks/useWeight';
import { CallExpander } from '@polkadot/react-params';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  noTmp?: boolean;
  value?: Preimage;
}

function PreimageCall ({ className = '', value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <>
      <td className={`${className} all`}>
        {value && value.isCompleted
          ? (
            <>
              {value.proposal && (
                <CallExpander
                  labelHash={t<string>('call')}
                  value={value.proposal}
                />
              )}
              {value.proposalError
                ? <MarkError content={value.proposalError} />
                : value.proposalWarning
                  ? <MarkWarning content={value.proposalWarning} />
                  : null
              }
            </>
          )
          : <div className='--tmp'>balances.transfer</div>
        }
      </td>
      <td className='address media--1300'>
        {value && value.isCompleted
          ? value.deposit
            ? (
              <AddressMini
                balance={value.deposit.amount}
                value={value.deposit.who}
                withBalance
              />
            )
            : null
          : (
            <AddressMini
              className='--tmp'
              value={ZERO_ACCOUNT}
            />
          )}
      </td>
    </>
  );
}

export default React.memo(PreimageCall);
