// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {Button, InputAddress} from '@polkadot/react-components';
import {useTranslation} from '@polkadot/app-accounts/translate';

interface Props {
  senderId?: string | null;
  value?: string | null;
  className?: string;
  title?: string;
  onChange: (accountId: string | null) => void;
  stepsState: string[];
  setStepsState: (stepsState: string[]) => void; // Dispatch<SetStateAction<string>>
  toggleCreate: () => void;
}

function ControllerAccountSelector ({ className, onChange, title, stepsState, setStepsState, toggleCreate, value, senderId }: Props): React.ReactElement<Props> {
  const [accountId, setAccountId] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect((): void => {
    if (accountId) {
      onChange(accountId)
    }
  },[accountId]);

  useEffect(() => {
    const newStepsState = [...stepsState];
    if (senderId && value && senderId !== value) {
      newStepsState[1] = 'completed';
      newStepsState[2] = newStepsState[2] === 'disabled' ? '' : newStepsState[2];
    } else {
      newStepsState[1] = '';
      newStepsState[2] = 'disabled';
    }
    setStepsState(newStepsState);
  },[senderId, value]);

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
        <div className="text-block">or</div>
        <Button
          icon='add'
          label={t('Add account')}
          onClick={toggleCreate}
        />
      </div>
    </section>
  );
}

export default React.memo(styled(ControllerAccountSelector)`
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
