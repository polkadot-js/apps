// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

function ScrollToTop ({ history }: RouteComponentProps): React.ReactElement {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });

    return () => {
      unlisten();
    };
  }, []);

  return <></>;
}

export default withRouter(ScrollToTop);
