# @polkadot/ui-identicon

A generic identity icon that can render icons based on the theme, be it Substrate or Polkadot

## Usage

To install the component, do `yarn add @polkadot/ui-identicon`

Inside a React component, you can now render any account with the associated icon -

```javascript
import Identicon from '@polkadot/ui-identicon';

...
render () {
	// address is an ss58-encoded address or publicKey (hex string or Uint8Array)
	const { address } = this.props;
	// size is a number, indicating the size (in pixels, 64 as default)
  const size = 32;
  // theme (optional), depicts the type of icon, either 'polkadot' or 'substrate' (default)
  const theme = 'polkadot';

	return (
		<Identicon
			className='my-class'
			value={address}
			size={size}
      theme={theme}
		/>
	);
}
...
```
