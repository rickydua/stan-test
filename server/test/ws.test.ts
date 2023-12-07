import { getHanshakeHeaders, encode, decode } from "../ws";

describe("getHanshakeHeaders", () => {
  test("should return headers", () => {
    const key = "randomKey";
    const headers = getHanshakeHeaders(key);
    const computedResult = "ldjsV2oTWgbpWAwypA0C7077A1Q=";
    expect(headers).toEqual(
      [
        "HTTP/1.1 101 Web Socket Protocol Handshake\r\n",
        "Upgrade: WebSocket\r\n",
        "Connection: Upgrade\r\n",
        `Sec-WebSocket-Accept: ${computedResult}\r\n`,
        "\r\n",
      ].join(""),
    );
  });
});

describe("encode", () => {
  test("should return encoded buffer from passed in data string - 125", () => {
    const data = "Hello World";
    const encoded = encode(data);
    const expected = Buffer.from([
      129, // the 0x80 | 0x01 frame
      data.length, // length
      ...Buffer.from(data), // data
    ]);
    expect(encoded).toEqual(expected);
  });

  test("should return encoded buffer from passed in data string - 126", () => {
    const data = Buffer.alloc(130);
    const encoded = encode(data);

    const secondByte = Buffer.alloc(2);
    secondByte.writeUInt16BE(data.length);

    const expected = Buffer.from([
      129, // the 0x80 | 0x01 frame
      126, // indicate that next 2 bytes are length
      ...secondByte, // spread the length into two bytes
      ...Buffer.from(data), // data
    ]);
    expect(encoded).toEqual(expected);
  });
});
