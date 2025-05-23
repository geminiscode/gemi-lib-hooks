//Types.tsx
/**
 *  -   En este archivo se definen los tipos de validadores que se utilizan en la librería de validación de propiedades.
 *  -   Estos tipos son utilizados para definir la estructura de los validadores y asegurar que se cumplan las 
 *  expectativas de entrada y salida.
 */


// Definición de respuesta para los validadores
type Type_Validadores_Response_Basic = true | string;

// Definición de estructura para los validadores
type Type_Validadores = (valor: unknown) => Type_Validadores_Response_Basic;

// Export de tipos para su uso en otros y este módulos
export type { Type_Validadores, Type_Validadores_Response_Basic };