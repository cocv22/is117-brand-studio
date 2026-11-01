"use strict";

(() => {
  const form = document.querySelector("#product-form");
  if (!form) return;

  const sizeError = document.querySelector("#size-error");
  const cartCount = document.querySelector("#cart-count");
  const cartStatus = document.querySelector("#cart-status");
  const cartEmpty = document.querySelector("#cart-empty");
  const cartItems = document.querySelector("#cart-items");
  const cartTotalRow = document.querySelector("#cart-total-row");
  const cartTotal = document.querySelector("#cart-total");
  const clearCart = document.querySelector("#clear-cart");
  const shopFromCart = document.querySelector("#cart-empty a");
  const shirtPreview = document.querySelector("#shirt-preview");
  const shirtMeaning = document.querySelector("#shirt-meaning");
  const unitPrice = Number(
    document.querySelector(".price-row").dataset.unitPrice,
  );
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  const sizes = ["S", "M", "L", "XL"];
  const designs = [
    { value: "FLY · 飛", key: "fly" },
    { value: "FIGHT · 闘", key: "fight" },
    { value: "DREAM · 夢", key: "dream" },
  ];
  const inkColors = [
    { value: "white", label: "White", fileSuffix: "" },
    { value: "crimson", label: "Crimson", fileSuffix: "-crimson" },
    { value: "gold", label: "Gold", fileSuffix: "-gold" },
    { value: "skyblue", label: "Sky blue", fileSuffix: "-skyblue" },
  ];
  const cart = [];
  const shineControl = document.querySelector('input[name="kanji-shine"]');

  const getSelectedInk = () =>
    inkColors.find(
      (color) =>
        color.value ===
        document.querySelector('input[name="kanji-color"]:checked')?.value,
    ) ?? inkColors[0];

  const getSelectedDesign = () =>
    designs.find(
      (design) =>
        design.value ===
        document.querySelector('input[name="design"]:checked')?.value,
    ) ?? designs[0];

  const updateShirtPreview = () => {
    const design = getSelectedDesign();
    const ink = getSelectedInk();
    const shiny = ink.value !== "white" && shineControl.checked;
    const finish = ink.value === "white" || shiny ? "" : "-matte";
    const finishDescription =
      ink.value === "white"
        ? ""
        : shiny
          ? " with a shine"
          : " with a matte finish";
    shirtPreview.src = `assets/resilience-${design.key}-shirt${ink.fileSuffix}${finish}.svg`;
    shirtPreview.alt = `Relaxed white ${design.key.toUpperCase()} T-shirt with ${design.value.split(" · ")[1]} in ${ink.label.toLowerCase()}${finishDescription} inside a black circle`;
    shirtMeaning.textContent = design.key.toUpperCase();
    shineControl.disabled = ink.value === "white";
  };

  const renderCart = () => {
    cartCount.textContent = String(cart.length);
    clearCart.disabled = cart.length === 0;
    clearCart.hidden = cart.length === 0;
    cartEmpty.hidden = cart.length > 0;
    cartItems.replaceChildren();

    cart.forEach((entry, index) => {
      const design = designs.find((item) => item.value === entry.design);
      const ink = inkColors.find((item) => item.value === entry.ink);
      const item = document.createElement("li");
      const description = document.createElement("span");
      const price = document.createElement("span");
      const remove = document.createElement("button");
      description.className = "cart-item-description";
      description.textContent = `White T-shirt · ${entry.design} · ${ink.label} kanji · Size ${entry.size}`;
      if (ink.value !== "white") {
        description.textContent += entry.shiny ? " · Shine" : " · Matte";
      }
      price.className = "cart-item-price";
      price.textContent = currency.format(unitPrice);
      remove.className = "text-button cart-remove";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.setAttribute(
        "aria-label",
        `Remove ${description.textContent} from cart`,
      );
      remove.addEventListener("click", () => {
        cart.splice(index, 1);
        renderCart();
        cartStatus.textContent =
          cart.length === 0
            ? `Removed ${design.value}. Your cart is empty. Add items to your cart.`
            : `Removed ${design.value}. Cart total: ${currency.format(cart.length * unitPrice)}.`;
        cartItems.querySelector("button")?.focus();
        if (cart.length === 0) shopFromCart.focus();
      });
      item.append(description, price, remove);
      cartItems.append(item);
    });

    cartTotalRow.hidden = cart.length === 0;
    cartTotal.textContent = currency.format(cart.length * unitPrice);
  };

  document
    .querySelectorAll('input[name="kanji-color"]')
    .forEach((input) => input.addEventListener("change", updateShirtPreview));
  document
    .querySelectorAll('input[name="design"]')
    .forEach((input) => input.addEventListener("change", updateShirtPreview));
  shineControl.addEventListener("change", updateShirtPreview);
  updateShirtPreview();
  renderCart();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = form.querySelector('input[name="size"]:checked');
    if (!selected || !sizes.includes(selected.value)) {
      sizeError.hidden = false;
      form.querySelectorAll('input[name="size"]').forEach((input) => {
        input.setAttribute("aria-invalid", "true");
      });
      form.querySelector('input[name="size"]').focus();
      return;
    }

    sizeError.hidden = true;
    const design = getSelectedDesign().value;
    const ink = getSelectedInk();
    const shiny = ink.value !== "white" && shineControl.checked;
    cart.push({ size: selected.value, design, ink: ink.value, shiny });
    renderCart();
    const itemWord = cart.length === 1 ? "item" : "items";
    cartStatus.textContent = `Added the ${design} white T-shirt with ${ink.label.toLowerCase()} kanji in size ${selected.value}. Your cart has ${cart.length} ${itemWord}. Cart total: ${currency.format(cart.length * unitPrice)}.`;
    if (ink.value !== "white") {
      cartStatus.textContent =
        `Added ${ink.label.toLowerCase()} kanji with ${shiny ? "shine" : "a matte finish"}. ` +
        cartStatus.textContent;
    }
  });

  form.addEventListener("change", () => {
    sizeError.hidden = true;
    form.querySelectorAll('input[name="size"]').forEach((input) => {
      input.removeAttribute("aria-invalid");
    });
  });

  clearCart.addEventListener("click", () => {
    cart.length = 0;
    renderCart();
    cartStatus.textContent = "Cart cleared. Your cart is empty.";
    shopFromCart.focus();
  });
})();
