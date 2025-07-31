// This runs before anything else
if (typeof window !== 'undefined') {
  // Clear all settings
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('polkadot') || key.includes('settings'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Set ESX endpoint
  window.localStorage.setItem('settings.apiUrl', 'wss://rpc1-weu-testnet.esx.network');
  console.log('Pre-init: Set ESX endpoint');
}
