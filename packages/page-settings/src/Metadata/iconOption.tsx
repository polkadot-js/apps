// Copyright 2017-2022 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
