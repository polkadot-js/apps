// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// some types, AppProps for the app and I18nProps to indicate
// translatable strings. Generally the latter is quite "light",
// `t` is inject into props (see the HOC export) and `t('any text')
// does the translation
import { BareProps, I18nProps } from '@polkadot/ui-app/types';

// external imports (including those found in the packages/*
// of this repo)
import React from 'react';

// our app-specific styles
import './index.css';

// local imports and components
import translate from './translate';

// define out internal types
type Props = BareProps & I18nProps;
type State = {};

class SummaryBar extends React.PureComponent<Props, State> {
  render () {
    return (
      // in all apps, the main wrapper is setup to allow the padding
      // and margins inside the application. (Just from a consistent pov)
      <summary>
        hello
      </summary>
    );
  }
}

export default translate(SummaryBar);
