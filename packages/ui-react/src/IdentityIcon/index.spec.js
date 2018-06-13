// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { shallow } from '../../test/enzyme';

import React from 'react';

import { IdentityIcon } from '../index';

describe('IdentityIcon', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <IdentityIcon className='test' />,
      {}
    );
  });

  it('creates the element', () => {
    expect(
      wrapper
    ).toBeDefined();
  });
});
