export class Validator {
  static isNotEmpty(value) {
    return value?.trim() !== "";
  }

  static isPhoneValid(value) {
    return value?.match(/^\d{8,11}$/) ? true : false;
  }

  static validateCustomer({ name, address, phone }) {
    const errors = [];
    if (!this.isNotEmpty(name)) errors.push("Nome é obrigatório");
    if (!this.isNotEmpty(address)) errors.push("Endereço é obrigatório");
    if (!this.isPhoneValid(phone)) errors.push("Telefone inválido");
    return errors;
  }
}
