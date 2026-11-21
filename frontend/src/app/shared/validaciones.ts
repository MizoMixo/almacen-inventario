export const REGEX_SERIE = /^[A-Z0-9][A-Z0-9-]{0,9}$/;
export const REGEX_NUMERO = /^[0-9]{1,10}$/;

export const hoyISO = () => new Date().toLocaleDateString('en-CA');

export function errorFecha(fecha: string): string {
  if (!fecha) return 'Ingresa la fecha.';
  if (fecha > hoyISO()) return 'La fecha no puede ser futura.';
  return '';
}

export function errorSerie(serie: string): string {
  const s = serie.trim();
  if (!s) return ''; // es opcional
  return REGEX_SERIE.test(s) ? '' : 'Usa letras, números o guion (máx. 10), sin espacios.';
}

export function errorNumero(numero: string): string {
  const n = numero.trim();
  if (!n) return 'Ingresa el número de documento.';
  if (!REGEX_NUMERO.test(n) || !/[1-9]/.test(n)) return 'Solo números (máx. 10); no puede ser todo ceros.';
  return '';
}

// Filtran los caracteres no permitidos mientras se escribe y devuelven el valor limpio
export function limpiarSerie(ev: Event): string {
  const el = ev.target as HTMLInputElement;
  el.value = el.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  return el.value;
}
export function limpiarNumero(ev: Event): string {
  const el = ev.target as HTMLInputElement;
  el.value = el.value.replace(/\D/g, '');
  return el.value;
}

// Clases de los cuadros: rojo si hay error
export function claseCampo(mensaje: string): string {
  return 'w-full rounded-lg border px-3 py-2 text-sm '
    + (mensaje ? 'border-red-500 bg-red-50 campo-error' : 'border-slate-300 bg-white');
}
export function claseCampoTabla(mensaje: string): string {
  return 'w-full rounded-lg border px-2 py-1.5 text-sm '
    + (mensaje ? 'border-red-500 bg-red-50 campo-error' : 'border-slate-300 bg-white');
}

// Desplazamientos de pantalla
export function irAlPrimerError() {
  setTimeout(() =>
    document.querySelector('.campo-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
}
export function irAId(id: string, bloque: ScrollLogicalPosition = 'center') {
  setTimeout(() =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: bloque }));
}
