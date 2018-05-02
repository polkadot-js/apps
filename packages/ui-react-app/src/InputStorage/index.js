// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StorageDef$Key } from '@polkadot/storage/types';
import type { BareProps } from '../types';

type Props = BareProps & {
  isError?: boolean,
  onChange?: (event: SyntheticEvent<*>, value: StorageDef$Key) => void,
  subject?: rxjs$Subject<StorageDef$Key>
};

require('./InputStorage.css');

const React = require('react');
const { BehaviorSubject } = require('rxjs/BehaviorSubject');

const SelectKey = require('./SelectKey');
const SelectSection = require('./SelectSection');
const withObservable = require('@polkadot/rx-react/with/observable');

module.exports = function InputStorage ({ className, onChange, style, subject }: Props): React$Node {
  const sectionSubject = new BehaviorSubject();
  const BoundKey = withObservable(sectionSubject)(SelectKey);

  return (
    <div
      className={['ui--InputStorage', 'ui--form', className].join(' ')}
      style={style}
    >
      <div className='small'>
        <SelectSection subject={sectionSubject} />
      </div>
      <div className='large'>
        <BoundKey
          onChange={onChange}
          subject={subject}
        />
      </div>
    </div>
  );
};
