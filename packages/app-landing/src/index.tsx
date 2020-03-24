// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// global app props
import { AppProps as Props } from '@polkadot/react-components/types';

import React from 'react';

import Navigate from './Navigate';
import landingInfo from '../images/landing.png';
import styled from 'styled-components';

function LandingApp ({ className }: Props): React.ReactElement<Props> {

  return (
    // in all apps, the main wrapper is setup to allow the padding
    // and margins inside the application. (Just from a consistent pov)
    <main className={className}>
      <div className='grid-container-outer'>
      <div className='your-journey-to-join'>
        Your journey to join CENNZnet starts here!
        <div className='create-your-cenn-znet'>
          Create your CENNZnet portfolio to build and interact with our CENNZnet blockchain
        </div>
      </div>
      <div className='group-3'>
        <img src={landingInfo} alt="Smiley face" height="313" width="463"/>
      </div>
      </div>
      <Navigate />
    </main>
  );
}
export default styled(LandingApp)`
  height: 100%;
  width: 100%;
  background-color: #FFFFFF;

.grid-container-outer {
    display: grid;
    grid-template-columns: repeat(auto-fit, 500px);
}
.your-journey-to-join {
  margin-left: 79px;
  margin-top: 209px;
  height: 108px;
  width: 412px;
  color: #000000;
  font-family: Lato;
  font-size: 26px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 36px;

  .create-your-cenn-znet {
    margin-top: 1 8px;
    margin-bottom: 155px;
    font-weight: lighter;
    height: 84px;
    width: 363px;
    color: #7F878D;
    font-family: Lato;
    font-size: 18px;
    letter-spacing: 0;
    line-height: 28px;
  }
}
.group-3 {
    margin-left: 47px;
    margin-top: 109px;
    margin-bottom: 144px;
    height: 313px;
    width: 463px;
  }
`;
