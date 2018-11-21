// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject(false);

export default {
  isDevelopment: (): boolean =>
    subject.getValue(),
  set: (isDevelopment: boolean): void => {
    subject.next(isDevelopment);
  },
  subject
};
