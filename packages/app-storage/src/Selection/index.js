// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import './Selection.css';

import React from 'react';
import InputStorage from '@polkadot/ui-react-app/src/InputStorage';

import subjects from '../subjects';
import translate from '../translate';
import Queue from './Queue';

type Props = I18nProps & {};

function Selection ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['storage--Selection', className].join(' ')}
      style={style}
    >
      <div className='ui--form'>
        <div className='full'>
          <InputStorage
            labelSection={t('selection.section', {
              defaultValue: 'query storage area'
            })}
            subject={subjects.next}
          />
        </div>
      </div>
      <div className='storage--Selection-ButtonRow'>
        <Queue />
      </div>
    </div>
  );
}

export default translate(Selection);
