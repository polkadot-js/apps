// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button } from '@polkadot/ui-app/index';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  nominating: string,
  stakingNominatorsFor: Array<string>,
  onClick: (index: number) => void
};

class UnnominateButton extends React.Component<Props> {
  render () {
    const { nominating, stakingNominatorsFor, style, t } = this.props;

    if (!nominating || !stakingNominatorsFor) {
      return null;
    }

    return (
      <Button
        className='staking--Account-buttons'
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
    const { accountId, stakingNominatorsFor, onClick } = this.props;

    onClick(
      stakingNominatorsFor
        .map((accountId) =>
          accountId.toString()
        )
        .indexOf(accountId));
  }
}

export default withMulti(
  UnnominateButton,
  translate,
  withObservable('stakingNominatorsFor', { paramProp: 'nominating' })
);
