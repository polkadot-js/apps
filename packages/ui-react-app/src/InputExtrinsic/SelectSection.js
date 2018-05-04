// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StateDb$SectionNames } from '@polkadot/storage/types';
import type { I18nProps } from '../types';

import React from 'react';

import RxDropdown from '../RxDropdown';
import translate from '../translate';
import createOptions from './options/section';

type Props = I18nProps & {
  isError?: boolean,
  label?: string,
  subject: rxjs$BehaviorSubject<StateDb$SectionNames>,
  type: 'private' | 'public'
};

function SelectSection ({ className, isError, label = '', subject, style, t, type }: Props): React$Node {
  const options = createOptions(type);

  return (
    <RxDropdown
      className={['ui--InputExtrinsic-SelectSection', className].join(' ')}
      defaultValue={subject.getValue()}
      isError={isError}
      label={label || t('input.extrinsic.section', {
        defaultValue: 'from extrinsic section'
      })}
      options={options}
      style={style}
      subject={subject}
    />
  );
}

export default translate(SelectSection);
