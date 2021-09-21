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

|Property|Description
|---|---
|from|pcks8 encoded public key of sender
|content|array of objects with a mime & a data attribute. The data attribues value is a cid to the data, as a plain string.
|sig|base64 encoded signature of `ts + JSON.stringify(content)`
|ts|timestamp of post (time of posting)

#### Message format
```json
{
  "from": "public key",
  "content": [
    {
      "mime": "text/plain",
      "data": "Cid"
    }
  ],
  "sig": "signature",
  "ts": 1287381923
}
```

### OnOpen channel
`/ipsm/-`

On this channel only plain strings (board names) are sent and are meant to help discover new boards.
This channel can safely be ignored.

### Sync channel
`/ipsm/-/{board}`


TODO: details

This channel can safely be ignored.

#### Message format

TODO
