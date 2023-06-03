
// Definir mensajes de error personalizados
export const joiMessages = {
    'any.required': 'El campo "{#label}" es requerido.',
    'string.empty': 'El campo "{#label}" no puede estar vacío.',
    'string.min': 'El campo "{#label}" debe tener al menos {#limit} caracteres.',
    'string.max': 'El campo "{#label}" no debe tener más de {#limit} caracteres.',
    'string.alphanum': 'El campo "{#label}" debe contener solo caracteres alfanuméricos.',
    'number.base': 'El campo "{#label}" debe ser un número.',
    'number.empty': 'El campo "{#label}" no puede estar vacío.',
    'number.integer': 'El campo "{#label}" debe ser un número entero.',
    'number.min': 'El campo "{#label}" debe ser mayor o igual a {#limit}.',
    'number.max': 'El campo "{#label}" debe ser menor o igual a {#limit}.',
    'string.email': 'El campo "{#label}" debe ser una dirección de correo válida.',
    'string.custom.validateCedula': 'La cédula no es válida.',
    'string.custom.validateBase64': 'El archivo debe estar en base 64',
    'objectId.invalid': 'El objectId no es válido',
  };
  