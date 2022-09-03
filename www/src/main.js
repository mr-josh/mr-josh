document.addEventListener("DOMContentLoaded", () => {
  const stack = document.getElementById("cardStackClips");
  const cards = stack.querySelectorAll("video");
  let activeCard = 0;

  stack.style.overflowX = "visible";

  const offsetAmount =
    (stack.clientWidth - cards[0].clientWidth) / cards.length;

  cards.forEach((video, index) => {
    video.style.position = "absolute";
    video.style.left = `${index * Math.floor(offsetAmount)}px`;

    video.addEventListener("mouseenter", (e) => {
      activeCard = index;
      cards.forEach((v, i) => {
        const layer = Math.abs(i - index) * -1;
        v.style.zIndex = layer;
        v.style.filter = `
          blur(${Math.abs(layer) * 1}px)
          brightness(${1 - Math.abs(layer) * 0.1})
        `;
        v.style.transform = `
          scaleY(${1 - Math.abs(layer) * 0.025})
        `;
      });
    });
  });

  let cycle;

  stack.addEventListener("mouseleave", () => {
    if (cycle) clearInterval(cycle);
    cycle = setInterval(() => {
      activeCard = (activeCard + 1) % cards.length;
      cards[activeCard].dispatchEvent(new Event("mouseenter"));
    }, 1000);
  });

  stack.addEventListener("mouseenter", () => {
    clearInterval(cycle);
  });

  cards[activeCard].dispatchEvent(new Event("mouseenter"));
  cycle = setInterval(() => {
    activeCard = (activeCard + 1) % cards.length;
    cards[activeCard].dispatchEvent(new Event("mouseenter"));
  }, 1000);
});
