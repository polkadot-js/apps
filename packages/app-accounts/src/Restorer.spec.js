// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';
import { shallow } from '../../../test/enzyme';

import { Restorer } from './Restorer';
import UploadButton from './UploadButton';

const mockT = (key, options) => (key);

describe('Restorer', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Restorer t={mockT} />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('should render UploadButton component', () => {
    expect(wrapper.find(UploadButton)).toHaveLength(1);
  });
});
