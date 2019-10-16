# Settings

Here you are able to tweak a number of the settings for your interface - where it connects to, the actual theme and if you are a developer, have access to some additional features to allow for a stress-free connection to a (possibly) custom chain.

# General

In the general section you can setup the basic operation for your UI.

- **endpoint** Defines the node to connect to. Select from one of the available hosted RPCs or connect to your own by specifying a custom URL. (Be aware that custom URLs should be behind secure WebSockets if you are using a UI hosted on a https endpoint)
- **theme** Swap between a Polkadot or Substrate themed interface.
- **mode** By default the UI appears in a fully-featured mode. You can select to only have the core features (which provides all the basics, unless you are a power user).

# Developer

In this section, you are able to define custom types to be added to the underlying API. When developing a custom chain, it is typical that additional types are added. Defining them here allows the underlying API (and therefore the UI) have an understanding how to encode and decode these types.

Types are saved across refreshes, so it is a single operation for all future usages of the UI. For the definitions, a simple JSON format is used, and example could be -

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

Be aware that the types are registered in the order they appear here, however it does support resolution independent of the order. (Circular deps are not supported here). For a slightly more complex example, using both types, enums, tuples and Compact numbers, the following would be used -

```
{
  "ArrayThing": "Vec<Thing>",
  "MyNumber": "u32",
  "Thing": {
    "count_enum": "SimpleEnum",
    "type_enum": "TypeEnum",
    "counter": "MyNumber",
    "tuple": "(u32, u64)",
    "ids": "Vec<AccountId>"
  },
  "SimpleEnum": {
    "_enum": ["One", "Two", "Three"]
  },
  "TypeEnum": {
    "_enum": {
      "One": "u32",
      "Two": "Compact<u64>",
      "Three": null
    }
  }
}
```
