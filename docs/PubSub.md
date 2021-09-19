# PubSub protocol

## Overview
|PubSub topic|Name|Description
|---|---|---
|`/ipsm/{board}`|Post|Post to a board
|`/ipsm/-`|OnOpen|Announcements of opening boards, allows for board discovery
|`/ipsm/-/{board}`|Sync|Sync messages

## General
TODO: msg encoding etc (utf string, json)

### Post channel
`/ipsm/{board}`

TODO: details

#### Message format
```json
{
  "from": "public key", //TODO: encoding
  "content": [
    {
      "mime": "text/plain",
      "data": "Cid" //TODO: encoding
    }
  ],
  "sig": "signature" //TODO: encoding, define what gets signed
}
```

### OnOpen channel
`/ipsm/-`

TODO: details

#### Message format

TODO

###Sync channel
`/ipsm/-/{board}`

TODO: details

#### Message format

TODO
