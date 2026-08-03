export function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
}

export function dotToKebab(str: string): string {
  return str.replaceAll(".", "-");
}
