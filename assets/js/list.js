import { Customer } from "./customers.js";

// Função para aplicar máscara de telefone
function formatPhone(input) {
  if (!input) return ""; // evita erro se for undefined/null

  let v = input.replace(/\D/g, ""); // remove tudo que não é número
  v = v.substring(0, 13); // limita o total de dígitos

  // +CC (DD) 9XXXX-XXXX
  if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d)/, "+$1 ($2"); // código do país
  }
  if (v.length > 4) {
    v = v.replace(/^\+(\d{2}) \((\d{2})(\d)/, "+$1 ($2) $3"); // DDD
  }
  if (v.length > 10) {
    v = v.replace(/(\d{5})(\d{4})$/, "$1-$2"); // hífen no número
  }

  return v; // <-- ESSENCIAL! Retorna o valor formatado
}

// Atualiza a tabela
export function updateTable() {
  const listCustomers = document.querySelector("#customer-list tbody");
  if (!listCustomers) return;

  listCustomers.innerHTML = "";
  const customers = Customer.getAllCustomers();

  customers.forEach((c) => {
    const row = document.createElement("tr");

    // Colunas
    const nameTd = document.createElement("td");
    nameTd.textContent = c.name;

    const addressTd = document.createElement("td");
    addressTd.textContent = c.address;

    const phoneTd = document.createElement("td");
    phoneTd.textContent = formatPhone(c.phone);

    // Botão editar / salvar
    const editBtn = document.createElement("button");
    editBtn.textContent = "🖋️";

    editBtn.addEventListener("click", () => {
      if (editBtn.textContent === "🖋️") {
        // Criar inputs para edição inline
        const nameInput = document.createElement("input");
        nameInput.value = c.name;

        const addressInput = document.createElement("input");
        addressInput.value = c.address;

        const phoneInput = document.createElement("input");
        phoneInput.value = formatPhone(c.phone);

        // Máscara em tempo real
        phoneInput.addEventListener("input", (e) => {
          e.target.value = formatPhone(e.target.value);
        });

        nameTd.innerHTML = "";
        nameTd.appendChild(nameInput);
        addressTd.innerHTML = "";
        addressTd.appendChild(addressInput);
        phoneTd.innerHTML = "";
        phoneTd.appendChild(phoneInput);

        editBtn.textContent = "💾"; // muda para salvar
      } else {
        // Salvar alterações com Promise
        new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              const updatedData = {
                name: nameTd.querySelector("input").value.trim(),
                address: addressTd.querySelector("input").value.trim(),
                phone: phoneTd.querySelector("input").value.replace(/\D/g, ""),
              };
              Customer.updateCustomer(c.internalId, updatedData);
              resolve(updatedData);
            } catch (err) {
              reject("Erro ao atualizar o cliente.");
            }
          }, 1000); // delay de 1s
        })
          .then((updatedData) => {
            nameTd.textContent = updatedData.name;
            addressTd.textContent = updatedData.address;
            phoneTd.textContent = formatPhone(updatedData.phone);

            editBtn.textContent = "🖋️"; // volta para editar
            alert("Cliente atualizado com sucesso!");
            updateTable?.();
          })
          .catch((err) => alert(err));
      }
    });

    // Botão deletar
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja excluir este cliente?")) {
        new Promise((resolve) => {
          setTimeout(() => {
            Customer.deleteCustomer(c.internalId);
            resolve("Cliente deletado com sucesso!");
          }, 500);
        }).then((msg) => {
          alert(msg);
          updateTable?.();
        });
      }
    });

    const tdEdit = document.createElement("td");
    tdEdit.appendChild(editBtn);

    const tdDelete = document.createElement("td");
    tdDelete.appendChild(deleteBtn);

    row.appendChild(nameTd);
    row.appendChild(addressTd);
    row.appendChild(phoneTd);
    row.appendChild(tdDelete);
    row.appendChild(tdEdit);

    listCustomers.appendChild(row);
  });
}

// Inicializa tudo
document.addEventListener("DOMContentLoaded", () => {
  updateTable();

  // --- CADASTRO DE NOVO CLIENTE ---
  const form = document.getElementById("customer-form");
  const nameInput = document.getElementById("name");
  const addressInput = document.getElementById("address");
  const phoneInput = document.getElementById("phone");

  // Máscara em tempo real no campo de cadastro
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      e.target.value = formatPhone(e.target.value);
    });
  }

  // Envio do formulário
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const customerData = {
        name: nameInput.value.trim(),
        address: addressInput.value.trim(),
        phone: phoneInput.value.replace(/\D/g, ""), // armazena só números
      };

      new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const newCustomer = new Customer(
              customerData.name,
              customerData.address,
              customerData.phone
            );
            newCustomer.save();
            resolve("Cliente cadastrado com sucesso!");
          } catch (err) {
            reject("Erro ao cadastrar o cliente.");
          }
        }, 1000);
      })
        .then((msg) => {
          alert(msg);
          form.reset();
          updateTable?.();
        })
        .catch((err) => alert(err));
    });
  }
});
