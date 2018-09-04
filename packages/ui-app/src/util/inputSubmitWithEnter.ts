// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// Allow user to submit form by pressing enter whilst input field still focussed
export default function inputSubmitWithEnter (event: any, node: any): void {
  if (event.keyCode === 13) {
    if (node instanceof HTMLElement) {
      const child = node.querySelector('.ui--accounts-Submit');

      if (child instanceof HTMLElement) {
        child.click();
        event.preventDefault();
      }
    }
  }
}
