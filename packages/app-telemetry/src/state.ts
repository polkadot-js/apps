import { Node } from './components/Node';
import { Types, Maybe } from '@dotstats/common';

export interface State {
  status: 'online' | 'offline' | 'upgrade-requested';
  best: Types.BlockNumber;
  blockTimestamp: Types.Timestamp;
  blockAverage: Maybe<Types.Milliseconds>;
  timeDiff: Types.Milliseconds;
  subscribed: Maybe<Types.ChainLabel>;
  chains: Map<Types.ChainLabel, Types.NodeCount>;
  nodes: Map<Types.NodeId, Node.Props>;
}

export type Update = <K extends keyof State>(changes: Pick<State, K> | null) => Readonly<State>;
