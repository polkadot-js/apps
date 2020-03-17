import { assetRegistry } from '@cennznet/crml-generic-asset';

const assets = assetRegistry.reserveAssets();
export const reservedAssets = assets.reduce((acc: { [index: string]: string }, asset) => {
  const key = asset.id;
  if (!asset.symbol.endsWith('-T')) {
    acc[key] = asset.symbol;
  }
  return acc;
}, {});
