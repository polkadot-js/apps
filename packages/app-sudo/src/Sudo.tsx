// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
import { I18nProps, WithSubmittableButtonProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { ComponentProps } from './types';

import React, { useState } from 'react';
import { createType } from '@polkadot/types';
import { Button, Icon, Extrinsic, TxButton, withSubmittableButton } from '@polkadot/react-components';
import { registry, withApi, withMulti } from '@polkadot/react-api';

import translate from './translate';

interface Props extends I18nProps, ApiProps, ComponentProps, WithSubmittableButtonProps {
  onChange: (accountId?: string) => void;
}

function Propose ({ apiDefaultTxSudo, isMine, onTextEnterKey, sudoKey, submitButtonRef, t }: Props): React.ReactElement<Props> {
  const [extrinsic, setExtrinsic] = useState<Call | null | undefined>(null);

  const _onChangeExtrinsic = (extrinsic?: Call | null): void => {
    setExtrinsic(extrinsic);
  };

  return isMine
    ? (
      <section>
        <Extrinsic
          defaultValue={apiDefaultTxSudo}
          label={t('submit the following change')}
          onChange={_onChangeExtrinsic}
          onEnter={onTextEnterKey}
        />
        <br />
        <Button.Group>
          <TxButton
            accountId={sudoKey}
            label={t('Submit Sudo')}
            icon='sign-in'
            method='sudo.sudo'
            isDisabled={!extrinsic}
            params={extrinsic ? [createType(registry, 'Proposal', extrinsic)] : []}
            innerRef={submitButtonRef}
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

export default withMulti(
  Propose,
  translate,
  withSubmittableButton,
  withApi
);
