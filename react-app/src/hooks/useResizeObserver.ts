import { useEffect, useRef, useState } from "react";

/**
 * Hook personalizado para observar cambios en dimensiones de elementos DOM
 * @param callback - Función a ejecutar cuando cambia el tamaño
 * @returns Ref para adjuntar al elemento que se quiere observar
 */
const useResizeObserver = <T extends HTMLElement>(
  callback?: (entry: ResizeObserverEntry) => void
) => {
  const elementRef = useRef<T | null>(null);
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    // Limpiar observer previo si existe
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Crear nuevo observer
    observerRef.current = new ResizeObserver((entries) => {
      if (!entries || !entries[0]) return;

      const entry = entries[0];

      if (callback) {
        callback(entry);
      }

      setDimensions(entry.contentRect);
    });

    // Adjuntar el observer al elemento
    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    // Limpiar al desmontar
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback]);

  return { ref: elementRef, dimensions };
};

export default useResizeObserver;