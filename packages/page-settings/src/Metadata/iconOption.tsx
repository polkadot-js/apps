// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Option {
  text: React.ReactNode;
  value: number | string;
}

export default function itemOption (label: string, value: string | number, img: string): Option {
  return {
    text: (
      <div
        className='ui--Dropdown-item'
        key={value}
      >
        <img
          alt={label}
          className='ui--Dropdown-icon'
          src={img}
        />
        <div className='ui--Dropdown-name'>{label}</div>
      </div>
    ),
    value
  };
}
