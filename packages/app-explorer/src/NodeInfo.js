// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';
import Chain from '@polkadot/ui-react-rx/Chain';
import NodeName from '@polkadot/ui-react-rx/NodeName';
import NodeVersion from '@polkadot/ui-react-rx/NodeVersion';

import translate from './translate';

type Props = I18nProps & {};

function NodeInfo ({ className, style, t }: Props): React$Node {
  return (
    <div className={classes('explorer--NodeInfo', className)}>
      <Chain label={t('app.chain', {
        defaultValue: 'chain: '
      })} />
      <NodeName label={t('app.name', {
        defaultValue: 'client: '
      })}
      />
      <NodeVersion label={t('app.name', {
        defaultValue: 'version: '
      })} />
    </div>
  );
}

export default translate(NodeInfo);
