// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { BareProps } from '../types';

type Props = BareProps & {
  isError?: boolean,
  isPrivate?: boolean,
  onChange?: (event: SyntheticEvent<*>, value: Extrinsic) => void,
  subject?: rxjs$Subject<Extrinsic>
};

require('./InputExtrinsic.css');

const React = require('react');
const { BehaviorSubject } = require('rxjs/BehaviorSubject');

const SelectMethod = require('./SelectMethod');
const SelectSection = require('./SelectSection');
const withObservable = require('@polkadot/rx-react/with/observable');

module.exports = function InputExtrinsic ({ className, isPrivate = false, onChange, style, subject }: Props): React$Node {
  const sectionSubject = new BehaviorSubject();
  const BoundMethod = withObservable(sectionSubject)(SelectMethod);

  return (
    <div
      className={['ui--InputExtrinsic', 'ui--form', className].join(' ')}
      style={style}
    >
      <div className='small'>
        <SelectSection
          isPrivate={isPrivate}
          subject={sectionSubject}
        />
      </div>
      <div className='large'>
        <BoundMethod
          isPrivate={isPrivate}
          onChange={onChange}
          subject={subject}
        />
      </div>
    </div>
  );
};
