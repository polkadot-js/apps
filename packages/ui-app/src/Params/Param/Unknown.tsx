// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { Props as BareProps, RawParam } from '../types';

import React from 'react';

import typeToString from '@polkadot/params/typeToString';

import Static from '../../Static';
import translate from '../../translate';
import Base from './Base';

type Props = BareProps & {
  defaultValue: RawParam,
  t: TranslationFunction,
  withLabel?: boolean
};

class Unknown extends React.PureComponent<Props> {
  render () {
    const { defaultValue: { value, type }, isDisabled, label, t, withLabel } = this.props;

    if (isDisabled) {
      return (
        <Static
          label={label}
          value={(value && value.toString()) || t('unknown.empty', { defaultValue: 'empty' })}
        />
      );
    }

    return (
      <Base
        size='full'
        label={label}
        withLabel={withLabel}
      >
        <div className='ui--Param-Unknown ui dropdown error selection'>
          {t('param.unknown', {
            defaultValue: `ERROR: Unimplemented type '{{type}}' requested. No renderer exists`,
            replace: {
              type: typeToString(type)
            }
          })}
        </div>
      </Base>
    );
  }
}

export default translate(Unknown);
