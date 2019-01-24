// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button } from '@polkadot/ui-app/index';
import { withCall, withMulti } from '@polkadot/ui-api/index';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  nominating: string,
  staking_nominatorsFor: Array<string>,
  onClick: (index: number) => void
};

class UnnominateButton extends React.Component<Props> {
  render () {
    const { nominating, staking_nominatorsFor, style, t } = this.props;

    if (!nominating || !staking_nominatorsFor) {
      return null;
    }

    return (
      <Button
        className='staking--Account-buttons'
        style={style}
        isNegative
        onClick={this.onClick}
        label={t('Unnominate')}
      />
    );
  }

  onClick = () => {
    const { accountId, staking_nominatorsFor, onClick } = this.props;

    onClick(
      staking_nominatorsFor
        .map((accountId) =>
          accountId.toString()
        )
        .indexOf(accountId));
  }
}

export default withMulti(
  UnnominateButton,
  translate,
  withCall('query.staking.nominatorsFor', { paramName: 'nominating' })
);
