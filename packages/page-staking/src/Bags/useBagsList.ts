// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u64 } from '@polkadot/types';
import type { PalletBagsListListBag } from '@polkadot/types/lookup';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

type Result = [string, u64, PalletBagsListListBag];

const multiOptions = {
  transform: ([[ids], opts]: [[u64[]], Option<PalletBagsListListBag>[]]): Result[] =>
    ids
      .map((id, index): [u64, Option<PalletBagsListListBag>] => [id, opts[index]])
      .filter(([, opt]) => opt.isSome)
      .map(([id, opt]): Result => [id.toString(), id, opt.unwrap()]),
  withParamsTransform: true
};

function useBagsListImpl (ids?: u64[]): Result[] | undefined {
  const { api } = useApi();

  return useCall(ids && ids.length !== 0 && api.query.bagsList.listBags.multi, [ids], multiOptions);
}

export default createNamedHook('useBagsList', useBagsListImpl);
