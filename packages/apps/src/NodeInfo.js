// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring';
import Chain from '@polkadot/ui-react-rx/Chain';
import NodeName from '@polkadot/ui-react-rx/NodeName';
import NodeVersion from '@polkadot/ui-react-rx/NodeVersion';

import translate from './translate';

type Props = I18nProps & {};

function updateTestInfo (chain?: string) {
  console.log('updateTestInfo:chain', chain);
  keyring.setTestMode(chain === 'dev');
}

function NodeInfo ({ className, style, t }: Props): React$Node {
  return (
    <div className={classes('apps--NodeInfo', className)}>
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

export default translate(NodeInfo);
