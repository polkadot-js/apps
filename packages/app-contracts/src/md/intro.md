# contracts

This contract management interface allows you to deploy WASM code for contracts, deploy contracts based on on-chain code and allows you to interact with contracts by sending messages.

## warning

Please be aware that this interface is very new and has not been thoroughly tested against all kinds of combinations of inputs - there are no doubt bugs lurking inside these sections. Additionally, the substrate contracts ABI is a very recent addition, and while stabilizing there may be changes and or-breakages while using this UI to interact.

With all that said - if you do find issues, please log them.

## basic operations

The interface has 3 main areas -

- **Code** This allows you to deploy WASM code on-chain or attach on-chain code into your local registry. Each code blob is identified by a unique hash, when deploying this will be saved, when attaching you would need to know the unique hash. From these bundles you can then move to the next step,
- **Instance** This allows you to create contract instances using on-chain WASM code. Select the code to use, attach the ABI, specify the contract values and the contract can be deployed. As with the Code section, you can also attach on-chain instances when you know the address.
- **Call** This allows you to send messages to contracts, via the address and attached ABIs.
