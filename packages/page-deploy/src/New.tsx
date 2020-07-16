// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from './types';

import React from 'react';
import { useParams } from 'react-router-dom';

function New (_: Props): React.ReactElement<Props> {
  const { id, index } = useParams();

  console.log(id, index);
  return (
    <>
      <header></header>
      <section></section>
      <footer></footer>
    </>
  );
}

export default React.memo(New);
