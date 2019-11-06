// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

export default class TxComponent<P, S> extends React.PureComponent<P, S> {
  protected button: any;

  constructor (props: P) {
    super(props);

    this.button = React.createRef();
  }

  protected sendTx = (): void => {
    const { component } = this.button.current;

    if (component) {
      component.current.send();
    }
  }

  protected submit = (): void => {
    if (this.button && this.button.current && this.button.current.click) {
      this.button.current.click();
    }
  }
}
