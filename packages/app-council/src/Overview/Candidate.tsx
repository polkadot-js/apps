// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { withMulti, withCalls } from '@polkadot/ui-api';
import { AddressCard, AddressInfo, Label } from '@polkadot/ui-app';

import translate from '../translate';

interface Props extends I18nProps {
  address: string;
  registerInfo?: [BN, BN] | null;
}

class Candidate extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { address, registerInfo, t } = this.props;

    return (
      <AddressCard
        defaultName='candidate'
        value={address}
      >
        <AddressInfo>
          {registerInfo && (
            <>
              <Label label={t('voting round')} />
              <div className='result'>#{registerInfo[0].toString()}</div>
              <Label label={t('list slot')} />
              <div className='result'>#{registerInfo[1].toString()}</div>
            </>
          )}
        </AddressInfo>
      </AddressCard>
    );
  }
}

export default withMulti(
  Candidate,
  translate,
  withCalls<Props>(
    [
      'query.elections.registerInfoOf',
      {
        paramName: 'address',
        propName: 'registerInfo',
        transform: (value: any) => value.unwrapOr(null)
      }
    ]
  )
);
