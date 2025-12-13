export function parsePrezzo(value: string): number | null {
  if (!value) return null;

  let v = value.replace(/\s/g, '');

  if (v.includes('.') && v.includes(',')) {
    const lastComma = v.lastIndexOf(',');
    const lastDot = v.lastIndexOf('.');

    if (lastComma > lastDot) {
      v = v.replace(/\./g, '').replace(',', '.');
    } else {
      v = v.replace(/,/g, '');
    }
  } else if (v.includes(',')) {
    v = v.replace(',', '.');
  } else {
    v = v.replace(/\./g, '');
  }

  const n = Number(v);
  return isNaN(n) ? null : n;
}
