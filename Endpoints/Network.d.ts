import type { Network } from './types.js';
import React from 'react';
interface Props {
    affinity?: string;
    apiUrl: string;
    className?: string;
    setApiUrl: (network: string, apiUrl: string) => void;
    value: Network;
}
declare function NetworkDisplay({ apiUrl, className, setApiUrl, value: { isChild, isRelay, isUnreachable, name, nameRelay: relay, paraId, providers, ui } }: Props): React.ReactElement<Props>;
declare const _default: React.MemoExoticComponent<typeof NetworkDisplay>;
export default _default;
