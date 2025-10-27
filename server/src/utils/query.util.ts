export function getPatchedFields<T extends {}>(
  patchable: [string, keyof T][],
  t: Partial<T>,
) {
  const patchedFields = [] as [string, T[keyof T]][];
  for (const [dbKey, tKey] of patchable) {
    if (typeof t[tKey] !== 'undefined') patchedFields.push([dbKey, t[tKey]]);
  }

  return patchedFields;
}
