// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WithTranslation } from 'react-i18next';
import { Props as BareProps, RawParam } from '../types';

import React from 'react';
import { Static } from '@polkadot/ui-app';
import translate from '@polkadot/ui-app/translate';

import Bare from './Bare';

type Props = BareProps & WithTranslation & {
  defaultValue: RawParam,
  withLabel?: boolean
};

class StaticParam extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, label, style, t } = this.props;
    const value = defaultValue && defaultValue.value && defaultValue.value.toString();

    return (
      <Bare
        className={className}
        style={style}
      >
        <Static
          className='full'
          label={label}
          value={value || t('empty')}
        />
      </Bare>
    );
  }
}

export default translate(StaticParam);
