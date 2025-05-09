// src/hooks/useMarkdownRenderer.jsx

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*UTILS------------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



//-- no apply



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*CUSTOM HOOK & EXPORTABLES----------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



const useMarkdownRenderer = (markdownContent) => {
    // Usa useMemo para evitar renderizados innecesarios
    const renderedContent = useMemo(() => (
        <ReactMarkdown
            children={markdownContent}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]} // Elimina rehypeRaw si no necesitas procesar HTML en Markdown
        />
    ), [markdownContent]);

    return renderedContent;
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/*EXPORTS----------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



export default useMarkdownRenderer;