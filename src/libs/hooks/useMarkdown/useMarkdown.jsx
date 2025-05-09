// src/hooks/useMarkdown/useMarkdown.jsx
import { useRef, useState, useCallback } from 'react';
import useMarkdownRenderer from './useMarkdownRenderer';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS -----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



// Puedes agregar aquí utilidades adicionales si son necesarias.



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK -----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const useMarkdown = () => {


    /*///////////////////////////////////////////////////////////////////////////////////////////*/
    /*VARIABLES (useRef y useState)-------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const editorRef = useRef(null); // Referencia al editor
    const [markdownContent, setMarkdownContent] = useState(''); // Estado para el contenido Markdown



    /*///////////////////////////////////////////////////////////////////////////////////////////*/
    /*FUNCIONES (useCallbacks)-------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    // Función para insertar una imagen al pegar
    const insertImage = useCallback((imgSrc, altText = "Imagen pegada") => {
        const imgMarkdown = `![${altText}](${imgSrc})`;
        setMarkdownContent((prev) => `${prev}\n${imgMarkdown}`);
    }, []);

    const handlePaste = useCallback((event) => {
        const clipboardItems = event.clipboardData.items;
        for (const item of clipboardItems) {
            if (item.type.includes("image")) {
                const file = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (e) => insertImage(e.target.result);
                reader.readAsDataURL(file);
                event.preventDefault();
                break;
            }
        }
    }, [insertImage]);

    const handleInputChange = useCallback((event) => {
        setMarkdownContent(event.target.value);
    }, []);



    /*///////////////////////////////////////////////////////////////////////////////////////////*/
    /*MARKDOWN RENDERING-------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const renderedMarkdown = useMarkdownRenderer(markdownContent);



    /*///////////////////////////////////////////////////////////////////////////////////////////*/
    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return {
        editorRef, // Referencia para el editor
        markdownContent, // Contenido Markdown actual
        setMarkdownContent, // Método para actualizar el contenido Markdown
        renderedMarkdown, // Contenido renderizado del Markdown
        handlePaste, // Manejar el evento de pegar
        handleInputChange, // Manejar cambios en el editor de texto
    };
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useMarkdown;