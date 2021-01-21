// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';

interface Props {
  className?: string;
}

function Actions (): React.ReactElement<Props> {
  return (
    <>
      <Button.Group>
      </Button.Group>
    </>
  );
}

export default React.memo(Actions);
