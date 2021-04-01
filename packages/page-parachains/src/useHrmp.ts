// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { HrmpChannel, HrmpChannelId } from '@polkadot/types/interfaces';
import type { AllChannels } from './types';

import { useEffect, useState } from 'react';

import { useApi, useCall, useEventTrigger } from '@polkadot/react-hooks';

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

export default function useHrmp (): AllChannels | undefined {
  const { api } = useApi();
  const [channelIds, setChannelIds] = useState<HrmpChannelId[] | null>(null);
  const trigger = useEventTrigger([api.events.hrmp?.OpenChannelAccepted, api.events.hrmp?.ChannelClosed]);
  const allChannels = useCall<AllChannels>(channelIds && api.query.hrmp?.hrmpChannels.multi, [channelIds], optChannels);

  useEffect((): void => {
    trigger &&
      api.query.hrmp?.hrmpChannels
        .keys<[HrmpChannelId]>()
        .then((keys) => setChannelIds(keys.map(({ args: [id] }) => id)))
        .catch(console.error);
  }, [api, trigger]);

  return allChannels;
}
