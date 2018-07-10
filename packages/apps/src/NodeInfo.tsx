// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import Chain from '@polkadot/ui-react-rx/Chain';
import NodeName from '@polkadot/ui-react-rx/NodeName';
import NodeVersion from '@polkadot/ui-react-rx/NodeVersion';

import translate from './translate';

type Props = I18nProps & {};

export function updateTestInfo (chain?: string): Boolean {
  if (typeof chain === 'undefined') return false;
  const re = new RegExp("(dev|loc)", "i");
  const match = re.test(chain.toLowerCase());
  keyring.setTestMode(match);
  return match ? true : false;
}

function NodeInfo ({ className, style, t }: Props) {
  console.log('t', t)
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
