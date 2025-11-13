// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { MarkWarning, styled } from '@polkadot/react-components';

const BrowserCheckAlert: React.FC = () => {
  const [isTargetBrowser, setIsTargetBrowser] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;

    // Detect Firefox
    const firefoxMatch = ua.match(/Firefox\/(\d+\.\d+)/);

    if (firefoxMatch) {
      // Check for Firefox 145.0 specifically
      if (ua.includes('145.0')) {
        setIsTargetBrowser(true);
      }
    }
  }, []);

  if (!isTargetBrowser) {
    return null;
  }

  return (
    <StyledBanner
      className='warning centered'
      withIcon={false}
    >

      The app is having some trouble running on Firefox v145.0. To keep everything running smoothly, please try using a different browser or switch to Firefox v144.0 for the moment.
    </StyledBanner>
  );
};

const StyledBanner = styled(MarkWarning)`
  border: 1px solid #ffc107;
  background: #ffc10720;
  font-size: 1rem !important;
  margin-bottom: 5rem !important;
`;

export default BrowserCheckAlert;
