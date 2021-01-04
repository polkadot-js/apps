// Copyright 2017-2021 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { AddressMini, InputAddress, Labelled, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

interface Props {
  allAccounts: string[];
  className?: string;
  isMine?: boolean;
  sudoKey?: string;
}

function SetKey ({ allAccounts, className = '', isMine, sudoKey }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect((): void => {
    sudoKey && !selected && setSelected(sudoKey);
  }, [selected, sudoKey]);

  const willLose = isMine &&
    !!selected &&
    selected !== sudoKey &&
    allAccounts.some((s): boolean => s === selected);

  return (
    <section>
      <section className={`${className} ui--row`}>
        {isMine
          ? (
            <>
              <InputAddress
                className='sudoInputAddress'
                isInput={true}
                label={t<string>('sudo key')}
                onChange={setSelected}
                type='all'
                value={selected}
              />
              <TxButton
                accountId={sudoKey}
                icon='sign-in-alt'
                isDisabled={!isMine || sudoKey === selected}
                label={t<string>('Reassign')}
                params={[selected]}
                tx={api.tx.sudo.setKey}
              />
            </>
          )
          : (
            <Labelled
              className='ui--Dropdown sudoLabelled'
              label={t<string>('sudo key')}
              withLabel
            >
              <AddressMini value={sudoKey} />
            </Labelled>
          )
        }
      </section>
      {willLose && (
        <article className='warning padded'>
          <div>{t<string>('You will no longer have sudo access')}</div>
        </article>
      )}
    </section>
  );
}

export default React.memo(styled(SetKey)`
  align-items: flex-end;
  justify-content: center;

  .summary {
    text-align: center;
  }

  .sudoInputAddress {
    margin: -0.25rem 0.5rem -0.25rem 0;
  }

  .sudoLabelled {
    align-items: center;
  }
`);
