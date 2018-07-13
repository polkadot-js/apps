// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import isTestChain from '@polkadot/ui-react-rx/util/isTestChain';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import Chain from '@polkadot/ui-react-rx/Chain';
import NodeName from '@polkadot/ui-react-rx/NodeName';
import NodeVersion from '@polkadot/ui-react-rx/NodeVersion';

import translate from './translate';

type Props = I18nProps & {};

function updateTestInfo (chain?: string) {
  keyring.setTestMode(isTestChain(chain));
}

class NodeInfo extends React.PureComponent<Props> {
  render () {
    const { className, style, t } = this.props;

    return (
      <div className={classes('apps--NodeInfo', className)} style={style}>
        <Chain
          label={t('info.chain', {
            defaultValue: 'chain: '
          })}
          onChange={updateTestInfo}
        />
        <NodeName label={t('info.name', {
          defaultValue: 'client: '
        })}
        />
        <NodeVersion label={t('info.name', {
          defaultValue: 'version: '
        })} />
      </div>
    );
  }
}

export default translate(NodeInfo);
