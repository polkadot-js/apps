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
  window.localStorage.setItem('settings.apiUrl', 'wss://rpc1-weu-testnet.esx.network:443');
  console.log('Pre-init: Set ESX endpoint');
}

// Add custom styles for ESX theme
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    /* Hide GitHub and Wiki buttons */
    .app--SideBar-Scroll a[href*="github.com"],
    .app--SideBar-Scroll a[href*="wiki.polkadot"],
    a[href*="github.com/polkadot-js"],
    a[href*="wiki.polkadot.network"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}
