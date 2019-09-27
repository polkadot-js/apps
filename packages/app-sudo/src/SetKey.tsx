// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { AddressMini, Icon, InputAddress, Labelled, TxButton } from '@polkadot/react-components';
import { ComponentProps } from './types';

import styled from 'styled-components';

import translate from './translate';

interface Props extends I18nProps, ComponentProps {}

function SetKey ({ allAccounts, className, isMine, sudoKey, t }: Props): React.ReactElement<Props> {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect((): void => {
    if (sudoKey && !selected) {
      setSelected(sudoKey);
    }
  }, [selected, sudoKey]);

  const willLose = isMine &&
    !!Object.keys(allAccounts).length &&
    !!selected &&
    selected !== sudoKey &&
    !Object.keys(allAccounts).find((s): boolean => s === selected);

  return (
    <section>
      <section className={`${className} ui--row`}>
        {isMine
          ? (
            <>
              <InputAddress
                className='sudoInputAddress'
                value={selected}
                label={t('sudo key')}
                isInput={true}
                onChange={setSelected}
                type='all'
              />
              <TxButton
                accountId={sudoKey}
                isDisabled={!isMine || sudoKey === selected}
                isPrimary
                label={t('Reassign')}
                icon='sign-in'
                params={[selected]}
                tx='sudo.setKey'
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
      </section>
      {willLose && (
        <article className='warning padded'>
          <div>
            <Icon name='warning' />
            {t('You will no longer have sudo access')}
          </div>
        </article>
      )}
    </section>
  );
}

export default translate(
  styled(SetKey)`
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
  `
);
