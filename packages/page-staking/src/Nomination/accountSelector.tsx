// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {Button, InputAddress} from '@polkadot/react-components';
import {useTranslation} from '@polkadot/app-accounts/translate';

interface Props {
  className?: string;
  title?: string;
  onChange: (accountId: string | null) => void;
  toggleCreate: () => void;
}

function AccountSelector ({ className, onChange, toggleCreate, title }: Props): React.ReactElement<Props> {
  const [accountId, setAccountId] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(
    (): void => onChange(accountId),
    [accountId, onChange]
  );

  return (
    <section className={className} >
      <h1>{title}</h1>
      <div className='ui--row'>
        <div className='large'>
          <InputAddress
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
