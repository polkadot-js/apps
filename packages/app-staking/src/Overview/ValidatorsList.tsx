// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-signer/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import { QueueConsumer } from '@polkadot/ui-signer/Context';

import translate from '../translate';
import AddressValidator from '@polkadot/ui-app/Address/AddressValidator'
import AddressIntention from '@polkadot/ui-app/Address/AddressIntention'

type Props = I18nProps & {
  current: Array<string>
  next: Array<string>,
};

class currentList extends React.PureComponent<Props> {
  render () {
    const { className, style, current, next } = this.props;

    return (
      <QueueConsumer>
        {({ queueExtrinsic }: QueueProps) => (
            <div
              className={classes('validator--ValidatorsList', className)}
              style={style}
            >
              <div className="validator--current">
                <h4>Current: {current.length}</h4>
                {current.map((account) => {
                  return (
                    <div key={account}>
                        <AddressValidator
                          className={classes('row', className)}
                          name={name || 'validator'} // TODO: check in our list of address is we named it
                          value={account}
                          withBalance={true}
                          withNonce={false}
                          identIconSize={48}
                          isShort={true}
                        />
                    </div>
                  );
                })}
              </div>
              <div className="validator--next">
                <h4>Next: {next.length}</h4>
                {next.map((account) => {
                  // TODO: filter out
                  // - current
                  // - 0 balance accounts
                  return (
                    <div key={account}>
                        <AddressIntention
                          className={classes('row', className)}
                          name={name || 'validator'} // TODO: check in our list of address is we named it
                          value={account}
                          withBalance={true}
                          withNonce={false}
                          identIconSize={48}
                          isShort={true}
                        />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
      </QueueConsumer>
    );
  }
}

export default translate(currentList);
