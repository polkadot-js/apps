// Copyright 2017-2020 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ComponentProps as Props } from './types';

import React, { useCallback, useState } from 'react';
import { Button, Icon, Extrinsic, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

function Propose ({ isMine, sudoKey }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiDefaultTxSudo } = useApi();
  const [method, setMethod] = useState<SubmittableExtrinsic<'promise'> | null>(null);

  const _onChangeExtrinsic = useCallback(
    (method: SubmittableExtrinsic<'promise'> | null = null) =>
      setMethod(() => method),
    []
  );

  return isMine
    ? (
      <section>
        <Extrinsic
          defaultValue={apiDefaultTxSudo}
          label={t('submit the following change')}
          onChange={_onChangeExtrinsic}
        />
        <br />
        <Button.Group>
          <TxButton
            accountId={sudoKey}
            icon='sign-in'
            isDisabled={!method}
            label={t('Submit Sudo')}
            params={[method]}
            tx='sudo.sudo'
          />
        </Button.Group>
      </section>
    )
    : (
      <article className='error padded'>
        <div>
          <Icon name='ban' />
          {t('You do not have access to the current sudo key')}
        </div>
      </article>
    );
}

export default React.memo(Propose);
