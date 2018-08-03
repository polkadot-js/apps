// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import storage from '@polkadot/storage';
import Button from '@polkadot/ui-app/Button';
import classes from '@polkadot/ui-app/util/classes';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withStorage from '@polkadot/ui-react-rx/with/storage';
import encodeAddress from '@polkadot/util-keyring/address/encode';

import translate from './translate';

type Props = I18nProps & {
  address: string,
  nominating: string,
  nominatorsFor: Array<string>,
  onClick: (index: number) => void
};

class UnnominateButton extends React.Component<Props> {
  render () {
    const { className, nominating, nominatorsFor, style, t } = this.props;

    if (!nominating || !nominatorsFor || nominatorsFor.length === 0) {
      return null;
    }

    return (
      <Button
        className={classes('staking--Account-buttons', className)}
        style={style}
        isNegative
        onClick={this.onClick}
        text={t('account.unnominate', {
          defaultValue: 'unnominate'
        })}
      />
    );
  }

  onClick = () => {
    const { address, nominatorsFor, onClick } = this.props;

    onClick(nominatorsFor.indexOf(address));
  }
}

export default withMulti(
  UnnominateButton,
  translate,
  withStorage(
    storage.staking.public.nominatorsFor,
    {
      propName: 'nominatorsFor',
      paramProp: 'nominating',
      transform: (publicKeys: Array<Uint8Array>) =>
        publicKeys.map(encodeAddress)
    }
  )
);
