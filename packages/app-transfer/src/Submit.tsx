// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IExtrinsic } from '@polkadot/types/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Index } from '@polkadot/types';
import { Button, TxButton } from '@polkadot/ui-app';
import { withCalls, withMulti } from '@polkadot/ui-api';

import translate from './translate';

type Props = I18nProps & {
  isDisabled: boolean,
  accountId?: string,
  system_accountNonce?: Index,
  extrinsic: IExtrinsic | null
};

class Submit extends React.PureComponent<Props> {
  render () {
    const { accountId, system_accountNonce, extrinsic, isDisabled, t } = this.props;

    return (
      <Button.Group>
        <TxButton
          accountId={accountId}
          accountNonce={system_accountNonce}
          isDisabled={isDisabled}
          isPrimary
          label={t('Make Transfer')}
          extrinsic={extrinsic}
        />
      </Button.Group>
    );
  }
}

export default withMulti(
  Submit,
  translate,
  withCalls<Props>(
    ['query.system.accountNonce', { paramName: 'accountId' }]
  )
);
