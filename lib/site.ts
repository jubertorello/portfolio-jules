// Datos de contacto (footer y menú).
export const SITE = {
  email: "julietabertorello@gmail.com",
  phone: "+34 660 10 40 26",
  /** El teléfono abre una conversación de WhatsApp. */
  whatsapp: "https://wa.me/34660104026",
} as const;

export const THEME_STORAGE_KEY = "byjules-tema";

/** Tema automático por la hora local del dispositivo: claro de DAY_START a DAY_END (h), oscuro el resto. */
export const DAY_START = 7;
export const DAY_END = 20;
