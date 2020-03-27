// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UpwardMessage } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { Card, Output, Static } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  dispatchQueue: UpwardMessage[];
}

function DispatchQueue ({ className, dispatchQueue = [] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h1>{t('relay dispatch queue')}</h1>
      {
        dispatchQueue.length === 0
          ? (
            <>
              {t('no messages')}
            </>
          )
          : (
            <>
              {
                dispatchQueue.map(({ origin, data }): React.ReactNode => {
                  return (
                    <Card
                      className='queue-message'
                      key={data.toHex()}
                    >
                      <div className='ui--row'>
                        <Static
                          className='full label-small'
                          help={t('Message origin.')}
                          label={t('origin')}
                          value={origin.toString()}
                        />
                      </div>
                      <div className='ui--row'>
                        <Output
                          className='full label-small'
                          help={t('Message data')}
                          isMonospace
                          label={t('data')}
                          value={data.toHex()}
                          withCopy
                        />
                      </div>
                    </Card>
                  );
                })
              }
            </>
          )
      }
    </div>
  );
}

export default React.memo(styled(DispatchQueue)`
  .queue-message {
    margin-bottom: 2rem;
  }
`);
