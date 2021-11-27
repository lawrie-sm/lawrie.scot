"use strict";

const letteriseSelector = ".letterise";
const zTextLetterClass = "bouncy-letter";
const zTextLetterSelector = `.${zTextLetterClass}`;
const zTextEyesSelector = "#the-watcher";

const elements = document.querySelectorAll(letteriseSelector);
elements.forEach((element) => {
  const text = element.innerHTML;
  element.innerHTML = "";
  text.split("").forEach((letter) => {
    const span = document.createElement("span");
    span.innerHTML = letter;
    span.classList.add(zTextLetterClass);
    element.appendChild(span);
  });
});

new Ztextify(zTextLetterSelector, {
  layers: 4,
  depth: "20px",
});

new Ztextify(zTextEyesSelector, {
  layers: 16,
  depth: "20px",
  event: "pointer",
});
