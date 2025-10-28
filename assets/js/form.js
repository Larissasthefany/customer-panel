import { Customer } from "./customers.js";
import { Validator } from "./validator.js";
import { updateTable } from "./list.js";

const form = document.getElementById("customer-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Pega os dados do formulário
  const customerData = Customer.getDataFromForm();

  // Validação
  const errors = Validator.validateCustomer(customerData);
  if (errors.length > 0) {
    alert(errors.join("\n"));
    return;
  }

  // Cria o cliente
  const newCustomer = new Customer(customerData.name, customerData.address, customerData.phone);

  // Salva de forma assíncrona usando Promise
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        newCustomer.save();
        resolve("Cliente cadastrado com sucesso!");
      } catch (err) {
        reject("Erro ao cadastrar o cliente.");
      }
    }, 1000); // simula 1s de delay
  })
    .then((msg) => {
      alert(msg);
      Customer.clearForm(form);
      updateTable?.(); // atualiza tabela se estiver disponível
    })
    .catch((err) => alert(err));
});
