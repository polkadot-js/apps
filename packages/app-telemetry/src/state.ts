import { NodeProps } from './components';
import { Types, Maybe } from '../../app-telemetry-common/src';

export interface State {
  status: 'online' | 'offline' | 'upgrade-requested';
  best: Types.BlockNumber;
  blockTimestamp: Types.Timestamp;
  blockAverage: Maybe<Types.Milliseconds>;
  timeDiff: Types.Milliseconds;
  subscribed: Maybe<Types.ChainLabel>;
  chains: Map<Types.ChainLabel, Types.NodeCount>;
  nodes: Map<Types.NodeId, NodeProps>;
}

export type Update = <K extends keyof State>(changes: Pick<State, K> | null) => Readonly<State>;
