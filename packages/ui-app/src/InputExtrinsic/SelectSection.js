// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic, ExtrinsicSectionName } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';

import React from 'react';

import RxDropdown from '../RxDropdown';
import translate from '../translate';
import createOptions from './options/section';

type Props = I18nProps & {
  defaultValue?: ExtrinsicSectionName,
  isError?: boolean,
  label?: string,
  onChange: (value: ExtrinsicSectionName) => void,
  type: 'private' | 'public',
  value: Extrinsic
};

function SelectSection ({ className, defaultValue, isError, label = '', onChange, style, t, type, value: { section } }: Props): React$Node {
  const options = createOptions(type);

  return (
    <RxDropdown
      className={['ui--RxDropdownLinked-Sections', className].join(' ')}
      defaultValue={defaultValue}
      isError={isError}
      label={label || t('input.extrinsic.section', {
        defaultValue: 'from extrinsic section'
      })}
      onChange={onChange}
      options={options}
      style={style}
      value={section}
    />
  );
}

export default translate(SelectSection);
