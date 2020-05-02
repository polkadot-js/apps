// Copyright 2017-2020 @polkadot/app-i18n authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Link } from 'react-router-dom';

export default function TranslateApp (): React.ReactElement<{}> {
  return (
    <main>This app has been moved to <Link to='/settings/i18n'>#/settings/i18n</Link></main>
  );
}
