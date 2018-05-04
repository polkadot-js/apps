// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { I18nProps } from '../types';

import React from 'react';

import RxDropdownLinked from '../RxDropdownLinked';
import translate from '../translate';
import keyOptions from './options/key';
import sectionOptions from './options/section';

type Props = I18nProps & {
  isError?: boolean,
  labelItem?: string,
  labelSection?: string,
  onChange?: (event: SyntheticEvent<*>, value: StorageDef$Key) => void,
  subject: rxjs$BehaviorSubject<StorageDef$Key>
};

function InputStorage ({ className, labelItem = '', labelSection = '', onChange, style, subject, t }: Props): React$Node {
  return (
    <RxDropdownLinked
      className={className}
      createItems={keyOptions}
      createSections={sectionOptions}
      labelItem={labelItem || t('input.storage.key', {
        defaultValue: 'with storage key'
      })}
      labelSection={labelSection || t('input.storage.section', {
        defaultValue: 'storage area'
      })}
      onChange={onChange}
      style={style}
      subject={subject}
    />
  );
}

export default translate(InputStorage);
