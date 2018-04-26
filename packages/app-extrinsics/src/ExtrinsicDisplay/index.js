// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '../extrinsics/types';
import type { BaseProps } from '../types';

import './ExtrinsicDisplay.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import withObservable from '@polkadot/rx-react/with/observable';

import translate from '../translate';
import Param from '../Param';
import { extrinsic } from '../subjects';
import createSubjects from './subjects';
import queueExtrinsic from './queue';

type Props = BaseProps & {
  value?: Extrinsic;
};

function ExtrinsicDisplay ({ className, style, t, value }: Props): React$Node {
  if (!value) {
    return null;
  }

  // TODO: Check for validity (i.e. button enable/disable)
  const subjects = createSubjects(value.params);
  const onSubmit = (): void =>
    queueExtrinsic(
      value,
      subjects.map((subject) => subject.getValue())
    );

  return (
    <div
      className={['extrinsics--ExtrinsicDisplay', className].join(' ')}
      style={style}
    >
      <div className='extrinsics--ExtrinsicDisplay-Params'>
        {
          value.params.map((param, index) => (
            <Param
              key={`${param.name}:${param.type}`}
              subject={subjects[index]}
              value={param}
            />
          ))
        }
      </div>
      <div className='extrinsics--ExtrinsicDisplay-ButtonRow'>
        <Button
          className='extrinsics--ExtrinsicDisplay-Button'
          onClick={onSubmit}
          primary
        >
          {t('calldisplay.submit', {
            defaultValue: 'Submit Extrinsic'
          })}
        </Button>
      </div>
    </div>
  );
}

export default translate(
  withObservable(extrinsic)(ExtrinsicDisplay)
);
