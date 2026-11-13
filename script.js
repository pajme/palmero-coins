const packages = {
  starter: { name: "500 Coins", price: 4.99 },
  standard: { name: "1.000 Coins", price: 8.99 },
  plus: { name: "2.500 Coins", price: 19.99 },
  elite: { name: "5.000 Coins", price: 34.99 },
  vip: { name: "10.000 Coins", price: 54.99 },
};

const cart = {};
const cartDialog = document.querySelector(".cart-dialog");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total strong");
const clearCartButton = document.querySelector(".clear-cart");
const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function renderCart() {
  cartItems.replaceChildren();
  const entries = Object.entries(cart);
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = entries.reduce((sum, [id, quantity]) => sum + packages[id].price * quantity, 0);

  cartCount.textContent = String(itemCount);
  cartTotal.textContent = euro.format(total);
  cartEmpty.classList.toggle("visible", itemCount === 0);
  clearCartButton.disabled = itemCount === 0;

  entries.forEach(([id, quantity]) => {
    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <span class="cart-item-name">${packages[id].name}</span>
      <span class="cart-item-price">${euro.format(packages[id].price * quantity)}</span>
      <div class="cart-item-controls">
        <button class="quantity-button" type="button" data-action="decrease" data-package="${id}" aria-label="${packages[id].name} verringern">−</button>
        <span>${quantity} × ${euro.format(packages[id].price)}</span>
        <button class="quantity-button" type="button" data-action="increase" data-package="${id}" aria-label="${packages[id].name} erhöhen">+</button>
        <button class="remove-item" type="button" data-action="remove" data-package="${id}">Entfernen</button>
      </div>`;
    cartItems.append(item);
  });
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.package;
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    button.innerHTML = "Hinzugefügt <span aria-hidden=\"true\">✓</span>";
    window.setTimeout(() => {
      button.innerHTML = "In den Warenkorb <span aria-hidden=\"true\">+</span>";
    }, 1100);
  });
});

document.querySelector(".cart-trigger").addEventListener("click", () => cartDialog.showModal());
document.querySelector(".close-cart").addEventListener("click", () => cartDialog.close());
clearCartButton.addEventListener("click", () => {
  for (const id of Object.keys(cart)) delete cart[id];
  renderCart();
});
cartDialog.addEventListener("click", (event) => {
  if (event.target === cartDialog) cartDialog.close();
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, package: id } = button.dataset;
  if (action === "increase") cart[id] += 1;
  if (action === "decrease") {
    cart[id] -= 1;
    if (cart[id] <= 0) delete cart[id];
  }
  if (action === "remove") delete cart[id];
  renderCart();
});

document.querySelectorAll("[data-payment]").forEach((button) => {
  button.addEventListener("click", () => {
    const identity = document.querySelector("#player-id").value.trim();
    if (Object.keys(cart).length === 0) {
      window.alert("Dein Warenkorb ist noch leer. Bitte wähle zuerst ein Coin-Paket.");
      return;
    }
    if (!identity) {
      document.querySelector("#player-id").reportValidity();
      return;
    }
    window.alert(`Demo-Shop: ${button.dataset.payment} ist nicht verbunden. Es wurde keine Zahlung ausgelöst.`);
  });
});

renderCart();
