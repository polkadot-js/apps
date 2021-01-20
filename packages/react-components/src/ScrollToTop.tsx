// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useScrollToTop } from '@canvas-ui/react-hooks';
import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

function ScrollToTop ({ history }: RouteComponentProps): React.ReactElement {
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    const unlisten = history.listen(() => {
      scrollToTop();
    });

    return () => {
      unlisten();
    };
  /* eslint-disable-next-line */
  }, []);

  return <></>;
}

export default withRouter(ScrollToTop);
