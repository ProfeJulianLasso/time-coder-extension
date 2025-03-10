import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import "./CustomScroll.css";

interface CustomScrollProps {
  children: ReactNode;
  className?: string;
}

/**
 * Componente contenedor que agrega un scrollbar personalizado
 */
const CustomScroll: FC<CustomScrollProps> = ({ children, className = "" }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [showScrollbar, setShowScrollbar] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [scrollRatio, setScrollRatio] = useState<number>(0);
  const [thumbHeight, setThumbHeight] = useState<number>(0);
  const [scrollStartPosition, setScrollStartPosition] = useState<number>(0);
  const [initialScrollTop, setInitialScrollTop] = useState<number>(0);
  const [scrollbarOpacity, setScrollbarOpacity] = useState<number>(0);
  const [hasScroll, setHasScroll] = useState<boolean>(false);

  /**
   * Verifica si es necesario mostrar el scrollbar
   */
  const checkScrollNeeded = (): void => {
    if (!contentRef.current || !containerRef.current) return;

    const { scrollHeight, clientHeight } = contentRef.current;
    const needsScroll = scrollHeight > clientHeight;

    setHasScroll(needsScroll);
    setShowScrollbar(needsScroll);

    if (needsScroll) {
      updateScrollbarMetrics();
    }
  };

  /**
   * Actualiza las métricas del scrollbar basado en el contenido
   */
  const updateScrollbarMetrics = (): void => {
    if (!contentRef.current || !thumbRef.current || !containerRef.current) return;

    const { scrollHeight, clientHeight, scrollTop } = contentRef.current;

    // Calcular la altura proporcional del thumb
    const thumbHeightPercentage = (clientHeight / scrollHeight) * 100;
    const calculatedThumbHeight = Math.max(
      (clientHeight * thumbHeightPercentage) / 100,
      30
    );

    setThumbHeight(calculatedThumbHeight);

    // Calcular la posición del thumb
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    const thumbPosition = scrollPercentage * (clientHeight - calculatedThumbHeight);

    if (thumbRef.current) {
      thumbRef.current.style.transform = `translateY(${thumbPosition}px)`;
    }

    // Calcular la ratio para el movimiento del thumb
    setScrollRatio(scrollHeight / clientHeight);
  };

  /**
   * Maneja el evento de scroll en el contenedor
   */
  const handleScroll = (): void => {
    if (!hasScroll) return;

    updateScrollbarMetrics();
    showScrollbarTemporarily();
  };

  // Añadimos una referencia para el temporizador
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Muestra el scrollbar temporalmente y luego lo oculta
   */
  const showScrollbarTemporarily = (): void => {
    setScrollbarOpacity(1);

    // Cancelar cualquier temporizador existente
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    // Crear un nuevo temporizador
    hideTimeoutRef.current = setTimeout(() => {
      if (!isDragging) {
        setScrollbarOpacity(0);
      }
      hideTimeoutRef.current = null;
    }, 1500);
  };

  /**
   * Inicia el arrastre del thumb
   */
  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setScrollStartPosition(e.clientY);

    if (contentRef.current) {
      setInitialScrollTop(contentRef.current.scrollTop);
    }

    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);
  };

  /**
   * Maneja el movimiento del thumb durante el arrastre
   */
  const handleDocumentMouseMove = (e: MouseEvent): void => {
    if (!isDragging || !contentRef.current) return;

    const deltaY = e.clientY - scrollStartPosition;
    const newScrollTop = initialScrollTop + deltaY * scrollRatio;

    contentRef.current.scrollTop = newScrollTop;
  };

  /**
   * Finaliza el arrastre del thumb
   */
  const handleDocumentMouseUp = (): void => {
    setIsDragging(false);

    document.removeEventListener("mousemove", handleDocumentMouseMove);
    document.removeEventListener("mouseup", handleDocumentMouseUp);

    // Ocultar el scrollbar después de un tiempo si no está en hover
    setTimeout(() => {
      if (!isDragging) {
        setScrollbarOpacity(0);
      }
    }, 1500);
  };

  /**
   * Maneja el clic en el track del scrollbar
   */
  const handleScrollbarTrackClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!contentRef.current || !scrollbarRef.current || !thumbRef.current) return;

    const { top: trackTop } = scrollbarRef.current.getBoundingClientRect();
    const clickPosition = e.clientY - trackTop;

    // Calcular la nueva posición relativa al contenedor
    const newScrollTop = (clickPosition / scrollbarRef.current.clientHeight) * contentRef.current.scrollHeight;

    contentRef.current.scrollTop = newScrollTop;
  };

  // Inicializar y actualizar el scrollbar cuando cambie el contenido
  useEffect(() => {
    checkScrollNeeded();

    const resizeObserver = new ResizeObserver(() => {
      checkScrollNeeded();
    });

    // Observar el contenedor y el contenido
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // También verificar cuando se cambie el contenido mediante un MutationObserver
    const mutationObserver = new MutationObserver(() => {
      checkScrollNeeded();
    });

    if (contentRef.current) {
      mutationObserver.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }

    // Verificar periódicamente (útil para cambios de pestañas o contenido dinámico)
    const intervalId = setInterval(() => {
      checkScrollNeeded();
    }, 500);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      clearInterval(intervalId);
    };
  }, [children]);

  // Manejar el evento de rueda del mouse
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
    if (!contentRef.current || !hasScroll) return;

    // Mostrar el scrollbar cuando se usa la rueda
    showScrollbarTemporarily();
  };

  // Mostrar el scrollbar al hacer hover en el contenedor
  const handleMouseEnter = (): void => {
    if (hasScroll) {
      setScrollbarOpacity(1);
    }
  };

  const handleMouseLeave = (): void => {
    if (!isDragging) {
      setScrollbarOpacity(0);
    }
  };

  return (
    <div
      className={`custom-scroll-container ${className}`}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="custom-scroll-content"
        ref={contentRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
      >
        {children}
      </div>

      {hasScroll && (
        <div
          className="custom-scrollbar"
          ref={scrollbarRef}
          onClick={handleScrollbarTrackClick}
          style={{ opacity: scrollbarOpacity }}
        >
          <div
            className="custom-scrollbar-thumb"
            ref={thumbRef}
            style={{ height: thumbHeight }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      )}
    </div>
  );
};

export default CustomScroll;