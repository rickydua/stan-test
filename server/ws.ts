import crypto from "crypto";

const MAGIC_STRING = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
const PAYLOAD_LENGTH_125 = 125;
const PAYLOAD_LENGTH_126 = 126;
const PAYLOAD_LENGTH_127 = 127;
const MASKING_KEY_LENGTH = 4;

type BufferPacketParameters = {
  payloadLength: number | bigint;
  payloadOffset: number;
  maskOffset: number;
};

export const getHanshakeHeaders = (secWebKey: string) =>
  [
    "HTTP/1.1 101 Web Socket Protocol Handshake\r\n",
    "Upgrade: WebSocket\r\n",
    "Connection: Upgrade\r\n",
    `Sec-WebSocket-Accept: ${createSocketKey(secWebKey)}\r\n`,
    "\r\n",
  ].join("");

export function encode(data: any) {
  let dataBuff = Buffer.alloc(0);
  if (typeof data === "string") {
    dataBuff = Buffer.from(data);
  }

  if (typeof data === "object") {
    dataBuff = Buffer.from(JSON.stringify(data));
  }

  if (typeof data === "number") {
    dataBuff = Buffer.from(data.toString());
  }

  const length = dataBuff?.length || 0;
  const firstByte = Buffer.from([0x80 | 0x01]); // for now only dealing with one off send, not continuation, hence why the value is 129
  const lengthBytesWithoutMask = determinePayloadLength(length);
  const payload = Buffer.concat([firstByte, lengthBytesWithoutMask, dataBuff]);

  return payload;
}

function determinePayloadLength(length: number) {
  if (length <= PAYLOAD_LENGTH_125) {
    return Buffer.from([length]);
  }

  if (length >= PAYLOAD_LENGTH_126 && length <= 0xffff) {
    let lengthBuffer = Buffer.alloc(2);
    lengthBuffer.writeUInt16BE(length);
    return Buffer.from([126, ...lengthBuffer]);
  }

  if (length <= PAYLOAD_LENGTH_127) {
    const lengthBuffer = Buffer.alloc(8);
    lengthBuffer.writeBigUint64BE(BigInt(length));
    return Buffer.from([127, ...lengthBuffer]);
  }

  return Buffer.from([]);
}
export function decode(packet: Buffer) {
  // these determine continuation
  const isFinalFrame = packet[0] >> 7;
  const opCode = packet[0];

  const isMasked = packet[1] >> 7;
  const { payloadLength, payloadOffset, maskOffset } =
    getBufferParameters(packet);

  const maskingKey = packet.subarray(
    maskOffset,
    maskOffset + MASKING_KEY_LENGTH
  );
  const payload = packet.subarray(
    payloadOffset,
    payloadOffset + parseInt(payloadLength?.toString() || "")
  );

  // inplace mutation of the payload
  umask(maskingKey, payload);

  return {
    isFinalFrame,
    opCode,
    isMasked,
    payloadLength,
    maskingKey,
    data: payload.toString("utf-8"),
  };
}

// Get different offsets in the buffer for various payload lengths
function getBufferParameters(packet: Buffer): BufferPacketParameters {
  const payloadLength = packet[1] & 0x7f;

  if (payloadLength <= PAYLOAD_LENGTH_125) {
    return { payloadLength: payloadLength, payloadOffset: 6, maskOffset: 2 };
  }

  if (payloadLength === PAYLOAD_LENGTH_126) {
    return {
      payloadLength: packet.subarray(2, 4).readUInt16BE(0),
      payloadOffset: 8,
      maskOffset: 4,
    };
  }

  if (payloadLength === PAYLOAD_LENGTH_127) {
    const payloadLength = packet.subarray(2, 10).readBigUint64BE(0);
    return {
      payloadLength: parseInt(payloadLength.toString()),
      payloadOffset: 12,
      maskOffset: 14,
    };
  }

  return { payloadLength: 0, payloadOffset: 0, maskOffset: 0 };
}

// WARNING: This will mutate the buffer `payloadData` in place
// This is done to avoid copying the buffer, for performance reasons, maybe I'm wrong and its worth copying the payloadData buffer
function umask(maskingKey: Buffer, payloadData: Buffer): void {
  for (let i = 0; i < payloadData.length; i++) {
    payloadData[i] = payloadData[i] ^ maskingKey[i % 4];
  }
}

function createSocketKey(key: string): string {
  return crypto
    .createHash("sha1")
    .update(key + MAGIC_STRING)
    .digest("base64");
}
