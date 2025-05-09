import { useCallback, useEffect, useRef } from "react";

/**
 * Hook personalizado para manipular cualquier selección de texto o contenido
 * dentro de un contenedor DOM referenciado.
 *
 * @function useSelection
 * @param {React.RefObject} containerRef - Referencia al contenedor donde se observarán y manipularán las selecciones.
 * @returns {Object} - Un objeto con funciones para manejar la selección.
 *
 * @example
 * import { useRef } from 'react';
 * import useSelection from './useSelection';
 * 
 * const TextEditor = () => {
 *   const containerRef = useRef();
 *   const { getSelection, setSelection, clearSelection } = useSelection(containerRef);
 * 
 *   const handleHighlight = () => {
 *     const selection = getSelection();
 *     if (selection) {
 *       console.log('Selection:', selection.text);
 *       // Aquí puedes agregar lógica para resaltar el texto seleccionado.
 *     }
 *   };
 * 
 *   return (
 *     <div>
 *       <div
 *         ref={containerRef}
 *         contentEditable
 *         style={{ border: "1px solid #ccc", padding: "10px", minHeight: "100px" }}
 *       >
 *         Este es un ejemplo de texto editable.
 *       </div>
 *       <button onClick={handleHighlight}>Obtener selección</button>
 *       <button onClick={clearSelection}>Limpiar selección</button>
 *     </div>
 *   );
 * };
 * 
 * export default TextEditor;
 */
const useSelection = (containerRef) => {
  const lastSelectionRef = useRef(null);

  /**
   * Obtiene la selección actual dentro del contenedor referenciado.
   * @returns {Object|null} Información de la selección o null si no hay selección.
   */
  const getSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    if (!containerRef.current.contains(range.commonAncestorContainer)) {
      return null; // La selección no está dentro del contenedor referenciado.
    }

    lastSelectionRef.current = range;
    return {
      text: selection.toString(),
      range,
    };
  }, [containerRef]);

  /**
   * Establece una selección específica dentro del contenedor referenciado.
   * @param {Range} range - Rango de selección que se debe establecer.
   */
  const setSelection = useCallback(
    (range) => {
      if (!containerRef.current.contains(range.commonAncestorContainer)) {
        throw new Error("El rango no pertenece al contenedor referenciado.");
      }
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    },
    [containerRef]
  );

  /**
   * Limpia la selección actual dentro del contenedor referenciado.
   */
  const clearSelection = useCallback(() => {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }, []);

  /**
   * Escucha los cambios en la selección dentro del contenedor referenciado.
   * @param {Function} callback - Función que se ejecutará cuando cambie la selección.
   */
  const onSelectionChange = useCallback(
    (callback) => {
      const handleSelectionChange = () => {
        const selection = getSelection();
        if (selection) callback(selection);
      };

      document.addEventListener("selectionchange", handleSelectionChange);

      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange);
      };
    },
    [getSelection]
  );

  // Limpia referencias al desmontar.
  useEffect(() => {
    return () => {
      lastSelectionRef.current = null;
    };
  }, []);

  return {
    getSelection,
    setSelection,
    clearSelection,
    onSelectionChange,
  };
};

export default useSelection;