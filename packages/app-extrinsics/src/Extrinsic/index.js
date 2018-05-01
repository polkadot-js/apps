// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-react-app/types';
import type { EncodedParams } from '../types';

import React from 'react';
import Label from 'semantic-ui-react/dist/es/elements/Label';
import withObservable from '@polkadot/rx-react/with/observable';
import InputExtrinsic from '@polkadot/ui-react-app/src/InputExtrinsic';

import Params from '../Params';
import createSubjects from './subjects';

type Props = BareProps & {
  isError?: boolean,
  isPrivate?: boolean,
  label: string,
  subject: rxjs$BehaviorSubject<EncodedParams>
};

export default function Extrinsic ({ className, isError, isPrivate, label, style, subject }: Props): React$Node {
  const subjects = createSubjects(subject);
  const MethodParams = withObservable(subjects.method)(Params);

  return (
    <div
      className={['extrinsics--Extrinsic', 'ui--form', className].join(' ')}
      style={style}
    >
      <div className='full'>
        <Label>{label}</Label>
        <InputExtrinsic
          isError={isError}
          isPrivate={isPrivate}
          subject={subjects.method}
        />
      </div>
      <MethodParams
        subject={subjects.params}
      />
    </div>
  );
}
