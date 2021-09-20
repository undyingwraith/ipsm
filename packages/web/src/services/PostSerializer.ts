import {ISerializedPost} from '@undyingwraith/ipsm-core';

export class PostSerializer {
	public static serialize(post: ISerializedPost): Uint8Array {
		return new TextEncoder().encode(JSON.stringify(post))
	}

	public static deserialize(data: Uint8Array): ISerializedPost{
		return JSON.parse(new TextDecoder().decode(data))
	}
}
