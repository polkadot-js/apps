// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export default class TxComponent<P, S> extends React.PureComponent<P, S> {
  protected button: any;

  constructor (props: P) {
    super(props);

    this.button = React.createRef();
  }

  protected sendTx = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const { component } = this.button.current;

    if (component) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      component.current.send();
    }
  }

  protected submit = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    if (this.button && this.button.current && this.button.current.click) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
      this.button.current.click();
    }
  }
}
