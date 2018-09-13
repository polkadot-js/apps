// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import AddressRow from '@polkadot/ui-app/AddressRow';

import translate from '../translate';

type Props = I18nProps & {
  current: Array<string>
  next: Array<string>
};

class CurrentList extends React.PureComponent<Props> {
  render () {
    return (
      <div className='validator--ValidatorsList'>
        <div className='validator--current'>
          {this.renderCurrent()}
        </div>
        <div className='validator--next'>
          {this.renderNext()}
        </div>
      </div>
    );
  }

  private renderCurrent () {
    const { current, t } = this.props;

    if (current.length === 0) {
      return null;
    }

    return [
      <h4>
        {t('list.current', {
          defaultValue: 'Current: {{count}}',
          replace: {
            count: current.length
          }
        })}
      </h4>,
      ...current.map((account) => {
        return (
          <AddressRow
            className='validator--row'
            key={account}
            name={name || t('name.validator', { defaultValue: 'validator' })}
            value={account}
            withBalance={true}
            withNonce={false}
            identIconSize={48}
            isShort={true}
          />
        );
      })
    ];
  }

  private renderNext () {
    const { next, t } = this.props;

    if (next.length === 0) {
      return null;
    }

    return [
      <h4>
        {t('list.next', {
          defaultValue: 'Next up: {{count}}',
          replace: {
            count: next.length
          }
        })}
      </h4>,
      ...next.map((account) => {
        return (
          <AddressRow
            className='validator--row'
            key={account}
            name={name || t('name.intention', { defaultValue: 'intention' })}
            value={account}
            withBalance={true}
            withNonce={false}
            identIconSize={48}
            isShort={true}
          />
        );
      })
    ];
  }
}

export default translate(CurrentList);
