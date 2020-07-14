// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

interface Option {
  text: React.ReactNode;
  value: number | string;
}

export default function itemOption (label: string, value: string | number, img: unknown): Option {
  return {
    text: (
      <div
        className='ui--Dropdown-item'
        key={value}
      >
        <img
          alt={label}
          className='ui--Dropdown-icon'
          src={img as string}
        />
        <div className='ui--Dropdown-name'>{label}</div>
      </div>
    ),
    value
  };
}
