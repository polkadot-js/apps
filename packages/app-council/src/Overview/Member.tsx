// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressCard } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  address: string;
  block: BlockNumber;
}

class Member extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { address, block, t } = this.props;

    return (
      <AddressCard
        buttons={<div><label>{t('active until')}</label>#{formatNumber(block)}</div>}
        defaultName='council member'
        value={address}
      />
    );
  }
}

export default translate(Member);
