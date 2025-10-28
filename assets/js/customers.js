

export class Customer {
  constructor(name, address, phone) {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.internalId = Date.now() + Math.floor(Math.random() * 1000); // ID único
  }

  // Cria cliente a partir do formulário
  static getDataFromForm() {
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone").value.trim();
    return new Customer(name, address, phone);
  }

  // Limpa formulário
  static clearForm(form) {
    form.reset();
  }

  // Salva cliente no localStorage
  save() {
    const customers = Customer.getAllCustomers();
    customers.push(this);
    localStorage.setItem("customers", JSON.stringify(customers));
  }

  // Retorna todos os clientes do localStorage
  static getAllCustomers() {
    return JSON.parse(localStorage.getItem("customers")) || [];
  }

  // Deleta cliente pelo internalId
  static deleteCustomer(id) {
    const customers = Customer.getAllCustomers();
    const updated = customers.filter(c => c.internalId !== id);
    localStorage.setItem("customers", JSON.stringify(updated));
  }
}
