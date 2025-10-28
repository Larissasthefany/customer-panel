import { Customer } from "./customers.js";

const listCustomers = document.querySelector("#customer-list tbody");

export function updateTable() {
  listCustomers.innerHTML = "";

  const customers = Customer.getAllCustomers();

  customers.forEach((c) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.name}</td>
      <td>${c.address}</td>
      <td>${c.phone}</td>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja excluir este cliente?")) {
        // Criando a Promise para simular operação assíncrona
        new Promise((resolve) => {
          setTimeout(() => {
            Customer.deleteCustomer(c.internalId); // chama corretamente o método da classe
            resolve("Cliente deletado!");
          }, 500); // simula atraso de 0,5s
        }).then((msg) => {
          alert(msg); // mostra mensagem de sucesso
          updateTable(); // atualiza a tabela
        });
      }
    });

    const tdButton = document.createElement("td");
    tdButton.appendChild(deleteBtn);
    row.appendChild(tdButton);

    listCustomers.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", updateTable);
