"use strict";

(() => {
  const form = document.querySelector("#product-form");
  if (!form) return;

  const sizeError = document.querySelector("#size-error");
  const bagCount = document.querySelector("#bag-count");
  const bagStatus = document.querySelector("#bag-status");
  const bagItems = document.querySelector("#bag-items");
  const clearBag = document.querySelector("#clear-bag");
  const sizes = ["S", "M", "L", "XL"];
  const designs = [
    { value: "FLY · 飛", key: "fly" },
    { value: "FIGHT · 闘", key: "fight" },
  ];
  const inkColors = [
    { value: "white", label: "White", fileSuffix: "" },
    { value: "crimson", label: "Crimson", fileSuffix: "-crimson" },
    { value: "gold", label: "Gold", fileSuffix: "-gold" },
    { value: "skyblue", label: "Sky blue", fileSuffix: "-skyblue" },
  ];
  const bag = [];
  const shineControl = document.querySelector('input[name="kanji-shine"]');

  const getSelectedInk = () =>
    inkColors.find(
      (color) =>
        color.value ===
        document.querySelector('input[name="kanji-color"]:checked')?.value,
    ) ?? inkColors[0];

  const updateShirtImages = () => {
    const ink = getSelectedInk();
    const shiny = ink.value !== "white" && shineControl.checked;
    designs.forEach((design) => {
      const image = document.querySelector(
        `input[name="design"][value="${design.value}"] + .design-option-content img`,
      );
      if (!image) return;
      const finish = ink.value === "white" || shiny ? "" : "-matte";
      image.src = `assets/resilience-${design.key}-shirt${ink.fileSuffix}${finish}.svg`;
      image.alt = `Relaxed white T-shirt with the ${design.value} kanji in ${ink.label.toLowerCase()}${shiny ? " with a shine" : " with a matte finish"} inside a black circle`;
    });
    shineControl.disabled = ink.value === "white";
  };

  const renderBag = () => {
    bagCount.textContent = String(bag.length);
    clearBag.disabled = bag.length === 0;
    bagItems.replaceChildren();
    designs.forEach((design) => {
      inkColors.forEach((ink) => {
        [true, false].forEach((shiny) => {
          sizes.forEach((size) => {
            const quantity = bag.filter(
              (item) =>
                item.size === size &&
                item.design === design.value &&
                item.ink === ink.value &&
                item.shiny === shiny,
            ).length;
            if (!quantity) return;
            const item = document.createElement("li");
            item.textContent = `White T-shirt · ${design.value} · ${ink.label} kanji · Size ${size} · Quantity ${quantity}`;
            bagItems.append(item);
            if (ink.value !== "white") {
              item.textContent += shiny ? " · Shine" : " · Matte";
            }
          });
        });
      });
    });
  };

  document
    .querySelectorAll('input[name="kanji-color"]')
    .forEach((input) => input.addEventListener("change", updateShirtImages));
  shineControl.addEventListener("change", updateShirtImages);
  updateShirtImages();

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
    const selectedMark = document.querySelector('input[name="design"]:checked');
    const design =
      selectedMark && designs.some((item) => item.value === selectedMark.value)
        ? selectedMark.value
        : designs[0].value;
    const ink = getSelectedInk();
    const shiny = ink.value !== "white" && shineControl.checked;
    bag.push({ size: selected.value, design, ink: ink.value, shiny });
    renderBag();
    const itemWord = bag.length === 1 ? "item" : "items";
    bagStatus.textContent = `Added the ${design} white T-shirt with ${ink.label.toLowerCase()} kanji in size ${selected.value}. Your demo bag has ${bag.length} ${itemWord}.`;
    if (ink.value !== "white") {
      bagStatus.textContent =
        `Added ${ink.label.toLowerCase()} kanji with ${shiny ? "shine" : "a matte finish"}. ` +
        bagStatus.textContent;
    }
  });

  form.addEventListener("change", () => {
    sizeError.hidden = true;
    form.querySelectorAll('input[name="size"]').forEach((input) => {
      input.removeAttribute("aria-invalid");
    });
  });

  clearBag.addEventListener("click", () => {
    bag.length = 0;
    renderBag();
    bagStatus.textContent =
      "Your demo bag is empty. Choose a size to try it again.";
    form.querySelector('input[name="size"]:checked')?.focus();
  });
})();
