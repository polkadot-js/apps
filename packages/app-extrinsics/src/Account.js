// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import Balance from '@polkadot/rx-react/Balance';
import withObservableParams from '@polkadot/rx-react/with/observableParams';
import InputAddress from '@polkadot/ui-react-app/src/InputAddress';

import translate from './translate';

type Props = I18nProps & {
  isError?: boolean,
  label: string,
  subject: rxjs$BehaviorSubject<Uint8Array>
};

class Account extends React.PureComponent<Props> {
  Balance: React$ComponentType<*>;

  constructor (props: Props) {
    super(props);

    this.Balance = withObservableParams(props.subject)(Balance, {
      className: 'ui disabled dropdown selection'
    });
  }

  render (): React$Node {
    const { className, label, subject, style, t } = this.props;
    const Balance = this.Balance;

    return (
      <div
        className={['extrinsics--Account', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='large'>
          <InputAddress
            label={label}
            placeholder='0x...'
            subject={subject}
          />
        </div>
        <div className='small'>
          <Label>
            {t('account.balance', {
              defaultValue: 'with an available balance of'
            })}
          </Label>
          <Balance />
        </div>
      </div>
    );
  }
}

export default translate(Account);
