// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';
import BestNumber from '@polkadot/ui-react-rx/BestNumber';

import BestHash from './BestHash';
import BlockHeaders from './BlockHeaders';
import translate from './translate';

type Props = I18nProps & {};

class ExplorerApp extends React.PureComponent<Props> {
  render () {
    const { className, style, t } = this.props;

    return (
      <div
        className={classes('explorer--App', className)}
        style={style}
      >
        <BestNumber
          className='explorer--BestNumber'
          label={t('app.bestNumber', {
            defaultValue: 'best #'
          })}
        />
        <BestHash />
        <BlockHeaders />
      </div>
    );
  }
}

export default translate(ExplorerApp);
