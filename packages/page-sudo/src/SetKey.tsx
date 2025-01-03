// Copyright 2017-2025 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { AddressMini, InputAddress, Labelled, styled, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate.js';

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
      <StyledSection className={`${className} ui--row`}>
        {isMine
          ? (
            <>
              <InputAddress
                className='sudoInputAddress'
                isInput={true}
                label={t('sudo key')}
                onChange={setSelected}
                type='all'
                value={selected}
              />
              <TxButton
                accountId={sudoKey}
                icon='sign-in-alt'
                isDisabled={!isMine || sudoKey === selected}
                label={t('Reassign')}
                params={[selected]}
                tx={api.tx.sudo.setKey}
              />
            </>
          )
          : (
            <Labelled
              className='ui--Dropdown sudoLabelled'
              label={t('sudo key')}
              withLabel
            >
              <AddressMini value={sudoKey} />
            </Labelled>
          )
        }
      </StyledSection>
      {willLose && (
        <article className='warning padded'>
          <div>{t('You will no longer have sudo access')}</div>
        </article>
      )}
    </section>
  );
}

const StyledSection = styled.section`
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
`;

export default React.memo(SetKey);
