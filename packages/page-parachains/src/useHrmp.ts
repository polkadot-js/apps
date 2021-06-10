// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { HrmpChannel, HrmpChannelId } from '@polkadot/types/interfaces';
import type { AllChannels } from './types';

import { useApi, useCall, useEventTrigger, useMapKeys } from '@polkadot/react-hooks';

const optChannels = {
  transform: ([[channelIds], channels]: [[HrmpChannelId[]], Option<HrmpChannel>[]]): AllChannels =>
    channelIds
      .map((id, index): [HrmpChannelId, Option<HrmpChannel>] => [id, channels[index]])
      .filter(([, opt]) => opt.isSome)
      .map(([id, opt]): [HrmpChannelId, HrmpChannel] => [id, opt.unwrap()])
      .reduce((all: AllChannels, [id, channel]): AllChannels => {
        all.dst[id.receiver.toString()] ||= [];
        all.src[id.sender.toString()] ||= [];

        all.dst[id.receiver.toString()].push([id, channel]);
        all.src[id.sender.toString()].push([id, channel]);

        return all;
      }, { dst: {}, src: {} }),
  withParamsTransform: true
};

function extractChannelIds (keys: StorageKey<[HrmpChannelId]>[]): HrmpChannelId[] {
  return keys.map(({ args: [id] }) => id);
}

export default function useHrmp (): AllChannels | undefined {
  const { api } = useApi();
  const trigger = useEventTrigger([
    (api.events.parasHrmp || api.events.hrmp)?.OpenChannelAccepted,
    (api.events.parasHrmp || api.events.hrmp)?.ChannelClosed
  ]);
  const channelIds = useMapKeys((api.query.parasHrmp || api.query.hrmp)?.hrmpChannels, { at: trigger.blockHash, transform: extractChannelIds });

  return useCall<AllChannels>(channelIds && (api.query.parasHrmp || api.query.hrmp)?.hrmpChannels.multi, [channelIds], optChannels);
}
