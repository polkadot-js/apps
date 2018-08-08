import React from 'react';
import expect from 'expect';
import { shallow } from '../test/enzyme';

import DownloadButton from './DownloadButton';

describe ('DownloadButton', () => {
  let wrapper;
  
  beforeEach(() => {
    wrapper = shallow(<DownloadButton className='test' />, {});
  });

  it('creates the element', () => {
    expect(wrapper).toBeDefined();
  });
});