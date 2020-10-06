// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps as Props } from '@polkadot/react-components/types';
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  faUsers,
  faCompass,
  faAddressBook,
  faExchangeAlt,
  faTools,
  faCoins
} from '@fortawesome/free-solid-svg-icons';

function Navigate({ className }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div className='explore-featured-fun'>Explore featured functions</div>
      <div className='grid-container'>
        <div className='feature'>
          <div className='icon'>
            <FontAwesomeIcon icon={faUsers} color='blue' size='3x' />
          </div>
          <div className='header'>Use it as an account</div>
          <div className='content'>
            <p>
              Create or import an account so that you can deposit or withdraw
              directly from the CENNZnet UI.
            </p>
            <p>
              You will need to have at least one account connected to
              participate in the network.
            </p>
          </div>
          <div className='action'>
            <Link to='/accounts'>
              <button className='button'>Go to Accounts</button>
            </Link>
          </div>
        </div>
        <div className='feature'>
          <div className='icon'>
            <FontAwesomeIcon icon={faExchangeAlt} color='blue' size='3x' />
          </div>
          <div className='header'>Send assets</div>
          <div className='content'>
            Send your CENNZnet assets between addresses.
          </div>
          <div className='action'>
            <Link to='/send-assets'>
              <button className='button'>Go to Send assets</button>
            </Link>
          </div>
        </div>
        <div className='feature'>
          <div className='icon'>
            <FontAwesomeIcon icon={faAddressBook} color='blue' size='3x' />
          </div>
          <div className='header'>Create an address book</div>
          <div className='content'>
            Make sending transactions easier by creating an address book of the
            accounts that you frequently interact with.
          </div>
          <div className='action'>
            <Link to='/accounts/addressBook'>
              <button className='button'>Go to Address book</button>
            </Link>
          </div>
        </div>
        <div className='feature'>
          <div className='icon'>
            <FontAwesomeIcon icon={faCompass} color='blue' size='3x' />
          </div>
          <div className='header'>Explore network activities</div>
          <div className='content'>Find out what's happening on CENNZnet.</div>
          <div className='action'>
            <Link to='/explorer'>
              <button className='button'>Go to Explorer</button>
            </Link>
          </div>
        </div>
        <div className='feature'>
          <div className='icon'>
            <FontAwesomeIcon icon={faTools} color='blue' size='3x' />
          </div>
          <div className='header'>Developer tools</div>
          <div className='content'>
            Looking for something more advanced? Find all the developer tools here.
          </div>
          <div className='action'>
            <Link to='/chainstate'>
              <button className='button'>Open Advanced</button>
            </Link>
          </div>
        </div>
        <div className='feature-not-supported'>
          <div className='icon'>
            <FontAwesomeIcon icon={faCoins} color='black' size='3x' />
          </div>
          <div className='header'>Staking / Delegate</div>
          <button className='no-action-button'>Coming soon</button>
        </div>
      </div>
    </div>
  );
}

export default styled(Navigate)`
  padding-top: 90px;
  height: 983px;
  width: 100%;
  background-color: #fafafa;

  .explore-featured-fun {
    margin-left: 79px;
    height: 58px;
    width: 477px;
    color: #5c5d5d;
    font-family: Lato;
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 0;
    line-height: 32px;
  }

  .grid-container {
    margin-left: 78px;
    max-width: 1236px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    grid-gap: 24px;

    .feature-not-supported {
      box-sizing: border-box;
      height: 372px;
      width: 290px;
      border: 1px dashed rgba(0, 0, 0, 0.6);
      border-radius: 20px;

      .no-action-button {
        border: none;
        margin-top: 160px;
        margin-bottom: 43.5px;
        margin-left: 91.5px;
        margin-right: 90.5px;
        height: 21px;
        width: 108px;
        transform: rotate(360deg);
        color: #000000;
        font-family: Lato;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0;
        line-height: 21px;
        text-align: center;
        background: inherit;
      }
    }

    .feature {
      height: 371px;
      width: 289px;
      border-radius: 20px;
      background-color: #ffffff;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);

      .content {
        margin-left: 24px;
        height: 147px;
        width: 242px;
        color: #7f878d;
        font-family: Lato;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 21px;
      }

      .action {
        margin-left: 24px;
        margin-right: 23px;
        box-sizing: border-box;
        height: 40px;
        width: 242px;
        border: 1px solid #000000;
        border-radius: 20px;
        background-color: #ffffff;
      }

      .button {
        border: none;
        height: 21px;
        width: 164px;
        margin-left: 39px;
        margin-right: 73px;
        padding-top: 9px;
        padding-bottom: 10px;
        transform: rotate(360deg);
        color: #000000;
        font-family: Lato;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 0;
        line-height: 21px;
        background: inherit;
      }
    }
  }

  .grid-container .icon {
    margin-top: 41px;
    margin-left: 27px;
    margin-bottom: 30px;
    margin-right: 200px;
  }

  .grid-container .header {
    margin-left: 24px;
    margin-bottom: 8px;
    height: 24px;
    width: 253px;
    color: #5c5d5d;
    font-family: Lato;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 0;
    line-height: 24px;
  }
`;
