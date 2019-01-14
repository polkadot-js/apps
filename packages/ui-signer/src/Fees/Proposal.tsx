// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { withCall, withMulti } from '@polkadot/ui-api/index';

import translate from '../translate';

type Props = I18nProps & {};
type State = {};

class Proposal extends React.PureComponent<Props, State> {
  render () {
    return null;
  }
}

export default withMulti(
  Proposal,
  translate,
  withCall('derive.balances.votingBalance', { paramProp: 'recipientId', propName: 'balanceFrom' })
);
