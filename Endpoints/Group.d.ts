import type { Group } from './types.js';
import React from 'react';
interface Props {
    affinities: Record<string, string>;
    apiUrl: string;
    children?: React.ReactNode;
    className?: string;
    index: number;
    isSelected: boolean;
    setApiUrl: (network: string, apiUrl: string) => void;
    setGroup: (groupIndex: number) => void;
    value: Group;
}
declare function GroupDisplay({ affinities, apiUrl, children, className, index, isSelected, setApiUrl, setGroup, value: { header, isSpaced, networks } }: Props): React.ReactElement<Props>;
declare const _default: React.MemoExoticComponent<typeof GroupDisplay>;
export default _default;
