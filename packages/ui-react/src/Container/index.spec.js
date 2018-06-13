// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { shallow } from '../../test/enzyme';

import React from 'react';

import { Container } from '../index';

describe('Container', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Container className='test' />,
      {}
    );
  });

  it('creates the element', () => {
    expect(
      wrapper
    ).toBeDefined();
  });
});
