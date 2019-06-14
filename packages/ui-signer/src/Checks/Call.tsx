// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedContractFees } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Icon } from '@polkadot/ui-app';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  fees: DerivedContractFees
};

export class Call extends React.PureComponent<Props> {
  render () {
    const { fees, t } = this.props;

    return (
      <>
        {
          (fees && fees.callBaseFee)
            ? <div>
                <Icon name='warning sign' />
                {t('A fee of {{callFee}} will be deducted from the sender to call the contract',
                  {
                    replace: {
                      callFee: formatBalance(fees.callBaseFee)
                    }
                  }
                )}
              </div>
            : undefined
        }
      </>
    );
  }
}

export default translate(Call);
