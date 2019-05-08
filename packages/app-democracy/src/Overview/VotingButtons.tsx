// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { Button, TxButton } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';

import translate from '../translate';

type Props = ApiProps & I18nProps & {
  accountId?: string,
  referendumId: BN
};

const NAY = 0;
const YAY = -1; // Yes, this is weird, but works on i8 with the high bit set

class VotingButton extends React.PureComponent<Props> {
  render () {
    const { accountId, referendumId, t } = this.props;

    return (
      <Button.Group>
        <TxButton
          accountId={accountId}
          isDisabled={!accountId}
          isNegative
          label={t('Nay')}
          params={[referendumId, NAY]}
          tx='democracy.vote'
        />
        <Button.Or />
        <TxButton
          accountId={accountId}
          isDisabled={!accountId}
          isPositive
          label={t('Aye')}
          params={[referendumId, YAY]}
          tx='democracy.vote'
        />
      </Button.Group>
    );
  }
}

export default withMulti(
  VotingButton,
  translate,
  withApi
);
