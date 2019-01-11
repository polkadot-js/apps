// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueTx$Extrinsic, QueueTx$ExtrinsicAdd } from '@polkadot/ui-app/Status/types';

import React from 'react';
import SubmittableExtrinsic from '@polkadot/api/promise/SubmittableExtrinsic';
import { Index } from '@polkadot/types';
import Button from '@polkadot/ui-app/Button';
import { withCall, withMulti } from '@polkadot/ui-api/index';

import translate from './translate';

type Props = I18nProps & {
  isDisabled: boolean,
  accountId?: string,
  query_system_accountNonce?: Index,
  extrinsic: SubmittableExtrinsic | null,
  queueExtrinsic: QueueTx$ExtrinsicAdd
};

class Submit extends React.PureComponent<Props> {
  render () {
    const { extrinsic, isDisabled, t } = this.props;

    return (
      <Button.Group>
        <Button
          isDisabled={isDisabled || !extrinsic}
          isPrimary
          onClick={this.onMakeTransfer}
          text={t('maketransfer', {
            defaultValue: 'Make Transfer'
          })}
        />
      </Button.Group>
    );
  }

  private onMakeTransfer = () => {
    const { accountId, query_system_accountNonce, extrinsic, queueExtrinsic } = this.props;

    if (!extrinsic) {
      return;
    }

    queueExtrinsic({
      extrinsic,
      accountId,
      accountNonce: query_system_accountNonce
    } as QueueTx$Extrinsic);
  }
}

export default withMulti(
  Submit,
  translate,
  withCall('query.system.accountNonce', { paramProp: 'accountId' })
);
