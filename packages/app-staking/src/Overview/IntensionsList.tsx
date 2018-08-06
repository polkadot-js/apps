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
import ValidatorAccount from './ValidatorAccount';

type Props = I18nProps & {
  intentions: Array<string>
};

class IntensionsList extends React.PureComponent<Props> {
  render () {
    const { className, style, intentions } = this.props;

    return (
      <QueueConsumer>
        {({ queueExtrinsic }: QueueProps) => (
          <div
            className={classes('validator--IntensionsList', className)}
            style={style}
          >
            {intentions.map((account) => {
              return (
                <div key={account}>
                   <ValidatorAccount
                      address={account}
                      key={account}
                      name={name || 'candidate'} // TODO: check in our list of address is we named it
                      queueExtrinsic={queueExtrinsic}
                    />
                </div>
              );
            })}
          </div>
        )}
      </QueueConsumer>
    );
  }
}

export default translate(IntensionsList);
