# IPSM PubSub Protocol

Below is a quick overview of all the different pubsub topics that IPSM uses. One doesn't have to use all of those
topics, you can pick and choose what you want.

|Topic|Name|Description
|---|---|---
|`/ipsm/{board}`|Post|Post to a board
|`/ipsm/-`|OnOpen|Announcements of opening boards, allows for board discovery
|`/ipsm/-/{board}`|Sync|Sync messages

## Post topic

`/ipsm/{board}`

### Post

The post is encoded as json.

#### Format

|Property|Description
|---|---
|from|CID of public key encoded as DER
|data|CID of data
|sigs|CID of signature object

#### Example

```json
{
  "from": "CID of public key",
  "data": "CID of payload",
  "sigs": "signature"
}
```

### Data

The data is encoded as dag-cbor.

#### Format

|Property|Description|Required
|---|---|---
|from|CID of public key encoded as DER
|content|array of objects with a mime & a data attribute. The data attribues value is a cid to the data, as a plain string.|**true**
|ts|unix timestamp of post time|**true**
|title|Title of the post (text)|*false*
|replyTo|CID of post that this is a reply to|*false*
| |Any additional properties you want to add, but not every implementation will understand|*false*


#### Example

```js
ipfs.dag.put({
    from: "CID of public key",
    content: [
        {
            mime: "image/jpeg",
            data: "bafybeiafrpc6aquayjvpimpupoluvzgokrlqk6fowhw7wqb2f5gwj2tadi",
        },
    ],
    title: "Such a rare sight",
    ts: 1632428006,
    // optional additional attributes
})
```

### Signatures

```js
ipfs.dag.put({
    "CID of public key": "base64 encoded signature of post"
})
```

## OnOpen topic

`/ipsm/-`

On this channel only plain strings (board names) are sent and are meant to help discover new boards.

## Sync topic

`/ipsm/-/{board}`

TODO: details

### Message format

TODO
