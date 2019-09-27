# Settings

Here you are able to tweak a number of the settings for your interface - where it connects to, the actual theme and if you are a developer, have access to some additional features to allow for a stress-free connection to a (possibly) custom chain.

# General

In the general section you can setup the basic operation for your UI.

- **endpoint** Defines the node to connect to. Select from one of the available hosted RPCs or connect to your own by specifying a custom URL. (Be aware that custome URLs should be behind secure WebSockets if you are using a UI hosted on a https endpoint)
- **theme** Swap between a Polkadot or Substrate themed interface.
- **mode** By default the UI appears in a fully-featured mode. You can select to only have the core features (which provides all the basics, unless you are a power user).

# Developer

In this section, you are able to define custom types to be added to the underlying API. When developing a custom chain, it is typical that additional types are added. Defining them here allows the underlying API (and therefore the UI) have an understanding how to encode and decode these types.

Types are saved accross refreshes, so it is a single operation for all future usages of the UI. For the definitions, a simple JSON format is used, and example could be -

```
{
  "TransactionInput": {
    "parent_output": "Hash",
    "signature": "Signature"
  },
  "TransactionOutput": {
    "value": "u128",
    "pubkey": "Hash",
    "sale": "u32"
  },
  "Transaction": {
    "inputs": "Vec<TransactionInput>",
    "outputs": "Vec<TransactionOutput>"
  }
}
```

Be aware that the types are registered in the order they appear here. Since `Transaction` above requires both `TransactionInput` and `TransactionOutput` it is defined after the definitions for those are available. (Circular deps are not supported here). For a slightly more complex example, using both types and enums, the following would be used -

```
{
  "SimpleEnum": {
    "_enum": ["One", "Two", "Three"]
  },
  "TypeEnum": {
    "_enum": {
      "One": "u32",
      "Two": "u64",
      "Three": null
    }
  },
  "MyNumber": "u32",
  "Thing": {
    "count_enum": "SimpleEnum",
    "type_enum": "TypeEnum",
    "counter": "MyNumber",
    "ids": "Vec<AccountId>"
  },
  "ArrayThing": "Vec<Thing>"
}
```
