// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { AddressCard } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  address: string;
  block: BlockNumber;
}

function Member ({ address, block, t }: Props): React.ReactElement<Props> {
  return (
    <AddressCard
      buttons={<div><label>{t('active until')}</label>#{formatNumber(block)}</div>}
      defaultName={t('council member')}
      value={address}
    />
  );
}

export default translate(Member);
