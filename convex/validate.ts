/**
 * Pulls `keys` off an untrusted object, returning null unless every one is a
 * string. The result is keyed by the requested names, so callers read fields
 * without casting.
 */
export function readStrings<K extends string>(
  source: Record<string, unknown>,
  keys: readonly K[],
): Record<K, string> | null {
  const result = {} as Record<K, string>;
  for (const key of keys) {
    const value = source[key];
    if (typeof value !== "string") return null;
    result[key] = value;
  }
  return result;
}
