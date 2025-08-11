import type { IFavoriteChainProps, IFavoriteChainsStorage } from './types.js';
export declare const FAVORITE_CHAINS_KEY = "polkadot-app-favorite-chains";
export declare const toggleFavoriteChain: (chainInfo: IFavoriteChainProps) => void;
export declare const getFavoriteChains: () => IFavoriteChainsStorage;
export declare const isFavoriteChain: (favoriteChains: IFavoriteChainsStorage, chainInfo: IFavoriteChainProps) => boolean;
export declare function getContrastingColor(hexColor: string): string;
