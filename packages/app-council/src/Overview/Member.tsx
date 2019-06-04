// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AddressRow, Card } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  address: string,
  block: BN
};

class Member extends React.PureComponent<Props> {
  render () {
    const { address, block, t } = this.props;

    return (
      <Card>
        <AddressRow
          buttons={<div><label>{t('active until')}</label>#{formatNumber(block)}</div>}
          defaultName='council member'
          value={address}
        />
      </Card>
    );
  }
}

export default translate(Member);
