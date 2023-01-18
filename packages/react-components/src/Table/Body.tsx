// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { isString } from '@polkadot/util';

import Spinner from '../Spinner';

interface Props {
  children?: React.ReactNode;
  className?: string;
  empty?: React.ReactNode | false;
  emptySpinner?: React.ReactNode;
  noBodyTag?: boolean;
}

function Body ({ children, className = '', empty, emptySpinner, noBodyTag }: Props): React.ReactElement<Props> {
  const bodyClassName = `${className} ui--Table-Body`;

  return children
    ? (
      noBodyTag
        ? <>{children}</>
        : <tbody className={bodyClassName}>{children}</tbody>
    )
    : (
      <tbody className={bodyClassName}>
        <tr>
          <td colSpan={100}>{
            isString(empty)
              ? <div className='empty'>{empty}</div>
              : empty || <Spinner label={emptySpinner} />
          }</td>
        </tr>
      </tbody>
    );
}

export default React.memo(Body);
