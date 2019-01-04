// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringOptions } from '@polkadot/ui-keyring/options/types';
import { QueueStatus, QueueTx, QueueAction$Add } from '@polkadot/ui-app/Status/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import keyringOption from '@polkadot/ui-keyring/options';
import { EventRecord } from '@polkadot/types';
import { Status as StatusDisplay } from '@polkadot/ui-app/index';
import { withCall, withMulti, withObservable } from '@polkadot/ui-react-rx/with';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import translate from './translate';

type Props = I18nProps & {
  optionsAll?: KeyringOptions,
  queueAction: QueueAction$Add,
  stqueue: Array<QueueStatus>,
  query_system_events?: Array<EventRecord>,
  txqueue: Array<QueueTx>
};

let prevEventHash: string;

class Status extends React.PureComponent<Props> {
  componentDidUpdate ({ optionsAll = { account: [] as any } as KeyringOptions, queueAction, query_system_events, t }: Props) {
    const eventHash = xxhashAsHex(stringToU8a(JSON.stringify(query_system_events || [])));

    if (eventHash === prevEventHash) {
      return;
    }

    prevEventHash = eventHash;

    const addresses = optionsAll.account.map((account) => account.value);

    (query_system_events || []).forEach(({ event: { data, method, section } }) => {
      if (section === 'balances' && method === 'Transfer') {
        const recipient = data[1].toString();

        if (addresses.includes(recipient)) {
          queueAction({
            action: method,
            status: 'received',
            value: recipient,
            message: t('transfer.received', {
              defaultValue: 'transfer received'
            })
          });
        }
      }
    });
  }

  render () {
    const { stqueue, txqueue } = this.props;

    return (
      <StatusDisplay
        stqueue={stqueue}
        txqueue={txqueue}
      />
    );
  }
}

export default withMulti(
  Status,
  translate,
  withCall('query.system.events'),
  withObservable(keyringOption.optionsSubject, { propName: 'optionsAll' })
);
