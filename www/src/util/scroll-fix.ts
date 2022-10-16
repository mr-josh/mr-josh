const setCSSProp = () => {
  document.body.style.setProperty(
    "--scrollbar-width",
    `${window.innerWidth - document.body.clientWidth}px`
  );
};

document.addEventListener("DOMContentLoaded", setCSSProp);

export { setCSSProp };
