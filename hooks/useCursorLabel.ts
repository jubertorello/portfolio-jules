"use client";

import { createContext, useContext } from "react";

export const CursorContext = createContext<(label: string | null) => void>(() => {});

/** Devuelve el setter del texto del cursor personalizado (`null` = cursor normal). */
export const useCursorLabel = () => useContext(CursorContext);
