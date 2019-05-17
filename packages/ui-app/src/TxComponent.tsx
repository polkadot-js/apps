// Copyright 2017-2019 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

// export default function send (ref: any = this): void {
//   const { component: { current: txButton } } = instance[refName].current;
//   if (txButton) {
//     txButton.send();
//   }
// }

export default class TxComponent<P, S> extends React.PureComponent<P, S> {
  button: any = React.createRef();

  sendTx = (): void => {
    const { component } = this.button.current;
    if (component) {
      component.current.send();
    }
  }

  submit = (): void => {
    this.button.current.click();
  }
}
