// Normaliza para o formato internacional (DDI 55) sem duplicar caso já esteja presente
export function whatsappUrl(phone: string, message: string): string {
  let digits = phone.replace(/\D/g, '')
  if (!(digits.startsWith('55') && digits.length >= 12)) digits = `55${digits}`
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
