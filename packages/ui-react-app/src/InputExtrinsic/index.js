// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';

import React from 'react';

import RxDropdownLinked from '../RxDropdownLinked';
import translate from '../translate';
import methodOptions from './options/method';
import sectionOptions from './options/section';

type Props = I18nProps & {
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange?: (event: SyntheticEvent<*>, value: Extrinsic) => void,
  subject: rxjs$BehaviorSubject<Extrinsic>
};

function InputExtrinsic ({ className, isPrivate = false, labelItem = '', labelSection = '', onChange, style, subject, t }: Props): React$Node {
  const type = isPrivate ? 'private' : 'public';

  return (
    <RxDropdownLinked
      className={className}
      createItems={methodOptions(type)}
      createSections={sectionOptions(type)}
      labelMethod={labelItem || t('input.extrinsic.method', {
        defaultValue: 'with the extrinsic'
      })}
      labelSection={labelSection || t('input.extrinsic.section', {
        defaultValue: 'from extrinsic section'
      })}
      onChange={onChange}
      style={style}
      subject={subject}
    />
  );
}

export default translate(InputExtrinsic);
