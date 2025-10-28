export function maskPhone(value: string): string {
  if (!value) return ""
  const cleaned = value.replace(/\D/g, "")

  if (cleaned.length > 10) {
    return cleaned
      .replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")
  }

  return cleaned
    .replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3")
}

export function maskCNPJ(value: string): string {
  if (!value) return ""
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1") 
}
