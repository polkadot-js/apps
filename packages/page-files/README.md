# @polkadot/app-files

## Description

***Substrate Files*** is a decentralized storage module which allows substrate-based chains(including `Polkadot/Kusama/Crust/Acala/Clover/Moonbeam/Astar/Phala/...`) users upload their files to [IPFS W3Auth Gateway](https://wiki.crust.network/docs/en/buildIPFSWeb3AuthGW) and decentralized pin their files on [Crust Network](https://crust.network) by using the standard [IPFS W3Auth Pinning Service](https://wiki.crust.network/docs/en/buildIPFSW3AuthPin). This module is a 100% IPFS compatible file storage module, users can pin **NFT files**, host **DApps** or store **on-chain data** in totally DECENTRALIZED way(`guaranteed by Crust protocol`).
Also, the Pinning Service is compatible with several Platforms like `Ethereum`, `Polygon`, `Solana` and `Near`, and funded by [Decentralized Cloud Foundation](https://decloudf.com/). So currently, `Substrate Files` is FREE for all the substrate-based chains!

## Features

Basically, the function is simple, it consist with 2 major parts: `Upload File` and `Manage File Directory`.

### Upload File

- Upload
![image](https://user-images.githubusercontent.com/10335300/132845864-86a43824-6b36-4dc4-bcfd-2cfb52bdcd56.png)

- Choose Gateway
![image](https://user-images.githubusercontent.com/10335300/132845963-f4027544-7aa1-419a-b6f2-0eab75159c60.png)

- Sign with Polkadot Account
![image](https://user-images.githubusercontent.com/10335300/132846016-e95d5cec-2a2f-4279-88a6-3a17965c4a27.png)

- View file info

![image](https://user-images.githubusercontent.com/10335300/132846267-b46fba84-d3b3-42ed-bd87-fc2593e638d3.png)

- View file status

> You can copy the cid to [Crust Apps](https://apps.crust.network/?rpc=wss%3A%2F%2Frpc.crust.network#/storage) to see how many IPFS replicas of your file

![image](https://user-images.githubusercontent.com/10335300/132846510-dc99d93d-f23c-45bf-86f0-3d2c9a7e55c4.png)

### Manage files directory

Because the whole files module is decentralized, so your file directory is cached in browser, but you can export and import your file directory info.

![image](https://user-images.githubusercontent.com/10335300/132846780-2911e8f0-7824-4e8a-980b-80e178b31e03.png)

## References

- [IPFS Web3 Authentication Gateway](https://wiki.crust.network/docs/en/buildIPFSWeb3AuthGW)
- [IPFS Web3 Authentication Pinning Service](https://wiki.crust.network/docs/en/buildIPFSW3AuthPin)
- [IPFS Public Gateway](https://docs.ipfs.io/concepts/ipfs-gateway/)
- [IPFS Pinning Service](https://docs.ipfs.io/how-to/work-with-pinning-services/#use-an-existing-pinning-service)
