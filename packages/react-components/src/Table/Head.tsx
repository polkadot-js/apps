// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

interface Props {
  className?: string;
  filter?: React.ReactNode;
  header: [React.ReactNode?, string?, number?, (() => void)?][];
  isEmpty: boolean;
}

function Head ({ className, filter, header, isEmpty }: Props): React.ReactElement<Props> {
  return (
    <thead className={className}>
      {filter && (
        <tr className='filter'>
          <th colSpan={100}>{filter}</th>
        </tr>
      )}
      <tr>
        {header.map(([label, className = 'default', colSpan = 1, onClick], index) =>
          <th
            className={className}
            colSpan={colSpan}
            key={index}
            onClick={onClick}
          >
            {
              index === 0
                ? <h1>{label}</h1>
                : isEmpty
                  ? ''
                  : label
            }
          </th>
        )}
      </tr>
    </thead>
  );
}

export default React.memo(Head);
