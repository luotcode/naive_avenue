export function Arrows(containerEl, opts = {}) {
  const leftSrc = "/assets/nAIve_left_arrow_yellow.png";
  const rightSrc = "/assets/nAIve_right_arrow_yellow.png";

  const STYLE_ID = "naive-arrows-pulse-style";
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `@keyframes naiveArrowPulse { 0% { opacity: 0.2 } 50% { opacity: 1 } 100% { opacity: 0.2 } }`;
    document.head.appendChild(style);
  }

  const onLeft = typeof opts.onLeft === "function" ? opts.onLeft : () => {};
  const onRight = typeof opts.onRight === "function" ? opts.onRight : () => {};

  const wrapper = document.createElement("div");
  wrapper.className = "naive-arrows";
  wrapper.style.position = "fixed";
  wrapper.style.top = "0";
  wrapper.style.left = "0";
  wrapper.style.width = "100%";
  wrapper.style.height = "100%";
  wrapper.style.pointerEvents = "none"; 
  wrapper.style.zIndex = "9999";

  const makeImg = (src, pos) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = pos + " arrow";
    img.style.position = "fixed";
    img.style.top = "50%";
    img.style.transform = "translateY(-50%)";
    img.style.pointerEvents = "auto"; 
    img.style.width = "90px";
    img.style.height = "90px";
    img.style.cursor = "pointer";
    img.style.userSelect = "none";
    img.style.background = "transparent";
    img.style.border = "none";
    img.style.padding = "6px";
    img.style.borderRadius = "8px";
    img.style.boxSizing = "border-box";
    img.style.transition = "transform 0.08s ease, opacity 0.12s ease";

    const dur = typeof opts.pulseDuration === "number" ? opts.pulseDuration : 2000;
    img.style.opacity = "0.2";
    img.style.animation = `naiveArrowPulse ${dur}ms ease-in-out infinite`;
    if (pos === "left") img.style.left = "16px";
    else img.style.right = "16px";
    img.addEventListener("mouseenter", () => (img.style.transform = "translateY(-50%) scale(1.05)"));
    img.addEventListener("mouseleave", () => (img.style.transform = "translateY(-50%) scale(1)"));
    return img;
  };

  const leftImg = makeImg(leftSrc, "left");
  const rightImg = makeImg(rightSrc, "right");

  const leftClick = (e) => {
    e.stopPropagation();
    onLeft(e);
  };
  const rightClick = (e) => {
    e.stopPropagation();
    onRight(e);
  };

  leftImg.addEventListener("click", leftClick);
  rightImg.addEventListener("click", rightClick);

  wrapper.appendChild(leftImg);
  wrapper.appendChild(rightImg);

  const mountTarget = (containerEl && containerEl.parentElement) || document.body;
  mountTarget.appendChild(wrapper);

  return {
    leftEl: leftImg,
    rightEl: rightImg,
    wrapper,
    dispose() {
      leftImg.removeEventListener("click", leftClick);
      rightImg.removeEventListener("click", rightClick);
      try {
        if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      } catch (err) {}
    },
  };
}
