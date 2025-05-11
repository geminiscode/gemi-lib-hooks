# Gemi-Lib-Hooks

Validadores de tipo para React.


## Instalación

npm install gemi-lib-hooks


## Uso

import { Validadores } from 'gemi-lib-hooks';


const validarNombre = Validadores.string.required('Nombre requerido');

console.log(validarNombre('Hola')); // true