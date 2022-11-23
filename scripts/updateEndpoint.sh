sed -i "s/__RPC_HOSTNAME__/$RPC_HOSTNAME/g" ./packages/apps-config/src/endpoints/chains.ts
sed -i "s/__APP_NAME__/$APP_NAME/g" ./packages/apps-config/src/endpoints/chains.ts ./packages/apps/public/locales/en/apps-config.json
