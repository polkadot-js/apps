// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { useScrollToTop } from '@canvas-ui/react-hooks';

function ScrollToTop ({ history }: RouteComponentProps): React.ReactElement {
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    const unlisten = history.listen(() => {
      scrollToTop();
    });

    return () => {
      unlisten();
    };
  }, []);

  return <></>;
}

export default withRouter(ScrollToTop);
