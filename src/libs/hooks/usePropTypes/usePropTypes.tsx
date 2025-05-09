




type Type_Validadores = (valor: unknown) => true | string;



interface Interface_Validadores {
    string: Type_Validadores;
    number: Type_Validadores;
    boolean: Type_Validadores;
}

interface ValidadorString {
  (valor: unknown): true | string;
  required(): (valor: unknown) => true | string;
  min(longitud: number): (valor: unknown) => true | string;
  max(longitud: number): (valor: unknown) => true | string;
}


function crearValidadorString(): ValidadorString {
    const validar = (valor: unknown): true | string => {
        if (typeof valor !== 'string') {
            return 'Error: El valor proporcionado no es un string.';
        }
        return true;
    };

    validar.required = () => {
        return (valor: unknown): true | string => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            if (valor === null || valor === undefined || valor === '') {
                return 'Error: El campo es requerido.';
            }

            return true;
        };
    };

    validar.min = (longitud: number) => {
        return (valor: unknown): true | string => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            if ((valor as string).length < longitud) {
                return `Error: Debe tener al menos ${longitud} caracteres.`;
            }

            return true;
        };
    };

    validar.max = (longitud: number) => {
        return (valor: unknown): true | string => {
            const result = validar(valor);
            if (typeof result === 'string') return result;

            if ((valor as string).length > longitud) {
                return `Error: No puede superar los ${longitud} caracteres.`;
            }

            return true;
        };
    };

    return validar as ValidadorString;
}



const Validadores: Interface_Validadores = {
    string(valor: unknown): true | string {
        if (typeof valor === 'string') {
            return true;
        }
        return 'Error: El valor proporcionado no es un string.';
    },
    number(valor: unknown): true | string {
        if (typeof valor === 'number' && !isNaN(valor)) {
            return true;
        }
        return 'Error: El valor proporcionado no es un número válido.';
    },
    boolean(valor: unknown): true | string {
        if (typeof valor === 'boolean') {
            return true;
        }
        return 'Error: El valor proporcionado no es un booleano.';
    },
};



export { Validadores }