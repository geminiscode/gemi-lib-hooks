// Validadores_Shape.tsx
import type { Type_Validadores, Type_Validadores_Response_Basic } from './Types';
import type { Interface_Validadores } from './Validadores';



type Schema<T extends Interface_Validadores> = {
  [K in keyof T]: T[K] extends infer U
    ? U extends Type_Validadores
      ? U
      : U extends Interface_Validadores_Shape
        ? ReturnType<U['shape']>
        : never
    : never;
};



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* INTERFACES ----------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



interface Interface_Validadores_Shape {
    /**
     * Valida que el valor sea un objeto.
     * @param valor - Valor a validar.
     * @returns true si es un objeto válido, sino un mensaje de error.
     */
    (valor: unknown): Type_Validadores_Response_Basic;

    /**
     * Valida que el objeto cumpla con una estructura definida.
     * @param schema - Objeto con validadores por campo.
     * @returns Función de validación.
     */
    shape<T extends Interface_Validadores>(
        schema: Schema<T>
    ): (valor: unknown) => Type_Validadores_Response_Basic | Record<keyof T, string>;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* BUILDER -------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/



function Build_Validadores_Shape(): Interface_Validadores_Shape {



    /*MAIN --------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    const validar = (valor: unknown): Type_Validadores_Response_Basic => {
        if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
            return 'Error: El valor proporcionado no es un objeto.';
        }
        return true;
    };



    /*CHAINED METHODS ---------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    validar.shape = <T extends Interface_Validadores>(schema: Schema<T>) => {
        return (valor: unknown): Type_Validadores_Response_Basic | Record<keyof T, string> => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            const obj = valor as Record<string, unknown>;
            const errores: Partial<Record<keyof T, string>> = {};

            for (const key in schema) {
                const rule = schema[key];
                const value = obj[key];

                // Si es otro shape, lo llamamos directamente
                if ('shape' in rule) {
                    const nestedValidator = rule as Interface_Validadores_Shape;
                    const nestedResult = nestedValidator(value);

                    if (typeof nestedResult === 'string') {
                        errores[key] = nestedResult;
                    } else if (!nestedResult) {
                        errores[key] = 'Error: Objeto anidado inválido.';
                    }

                    // Si es un validador básico
                } else {
                    const basicValidator = rule as Type_Validadores;
                    const res = basicValidator(value);
                    if (typeof res === 'string') {
                        errores[key] = res;
                    }
                }
            }

            // ✅ Aquí hacemos el cast explícito, ya que sabemos que todas las claves son keyof T
            return Object.keys(errores).length > 0
                ? (errores as Record<keyof T, string>)
                : true;
        };
    };



    /*RETURN ------------------------------------------------------------------------------------*/
    /*///////////////////////////////////////////////////////////////////////////////////////////*/



    return validar as Interface_Validadores_Shape;
}



/*///////////////////////////////////////////////////////////////////////////////////////////////*/
/* EXPORT ---------------------------------------------------------------------------------------*/
/*///////////////////////////////////////////////////////////////////////////////////////////////*/


export type { Schema };
export type { Interface_Validadores_Shape };
export const Validadores_Shape = Build_Validadores_Shape();