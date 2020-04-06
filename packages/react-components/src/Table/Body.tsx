// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { isString } from '@polkadot/util';

import Spinner from '../Spinner';

interface Props {
  children?: React.ReactNode;
  className?: string;
  empty?: React.ReactNode;
  isEmpty?: boolean;
}

function Body ({ children, className, empty, isEmpty }: Props): React.ReactElement<Props> {
  return (
    <tbody className={className}>
      {isEmpty
        ? (
          <tr><td colSpan={100}>{
            isString(empty)
              ? <div className='empty'>{empty}</div>
              : empty || <Spinner />
          }</td></tr>
        )
        : children
      }
    </tbody>
  );
}

export default React.memo(Body);
