import type { Group, IFavoriteChainProps, IFavoriteChainsStorage } from './types.js';
import React from 'react';
interface Props {
    affinities: Record<string, string>;
    apiUrl: string;
    children?: React.ReactNode;
    className?: string;
    index: number;
    isSelected: boolean;
    favoriteChains: IFavoriteChainsStorage;
    toggleFavoriteChain: (chainInfo: IFavoriteChainProps) => void;
    setApiUrl: (network: string, apiUrl: string) => void;
    setGroup: (groupIndex: number) => void;
    value: Group;
    highlightColor: string;
}
declare function GroupDisplay({ affinities, apiUrl, children, className, favoriteChains, highlightColor, index, isSelected, setApiUrl, setGroup, toggleFavoriteChain, value: { header, isSpaced, networks } }: Props): React.ReactElement<Props>;
declare const _default: React.MemoExoticComponent<typeof GroupDisplay>;
export default _default;
