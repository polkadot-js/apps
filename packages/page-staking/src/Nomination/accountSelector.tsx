// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {InputAddress} from '@polkadot/react-components';
import useBalance from "@polkadot/app-staking/Nomination/useBalance";

interface Props {
  value?: string | null;
  className?: string;
  title?: string;
  onChange: (accountId: string | null) => void;
  stepsState: string[];
  setStepsState: (stepsState: string[]) => void; // Dispatch<SetStateAction<string>>
}

function AccountSelector ({ className, onChange, title, stepsState, setStepsState, value }: Props): React.ReactElement<Props> {
  const [accountId, setAccountId] = useState<string | null>(null);
  const balance = useBalance(accountId);

  useEffect((): void => {
      if (accountId) {
        onChange(accountId)
      }
  },[accountId]);

  useEffect(() => {
    const newStepsState = [...stepsState];
    if (balance && balance.length > 3) {
      newStepsState[0] = 'completed';
      newStepsState[1] = newStepsState[1] === 'disabled' ? '' : newStepsState[1];
    } else {
      newStepsState[0] = '';
    }
    setStepsState(newStepsState);
  },[balance]);

  return (
    <section className={className} >
      <h1>{title}</h1>
      <div className='ui--row'>
        <div className='large'>
          <InputAddress
            defaultValue={value}
            value={value}
            className='medium'
            label={`select ${title}`}
            onChange={setAccountId}
            type='account'
          />
        </div>
      </div>
    </section>
  );
}

export default React.memo(styled(AccountSelector)`
  align-items: flex-end;

  .summary {
    text-align: center;
  }
  
  .text-block {
    width: 50px !important;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
  }
`);
