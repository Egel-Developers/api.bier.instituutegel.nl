function concatManyUint8Arrays(arrays: (Uint8Array | number[])[]): Uint8Array {
  const flattened = arrays.map((arr) =>
    arr instanceof Uint8Array ? arr : Uint8Array.from(arr)
  );
  const totalLength = flattened.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  for (const arr of flattened) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}

export const Utils = { concatManyUint8Arrays };
