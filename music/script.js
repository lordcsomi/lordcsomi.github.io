const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  const angle = Math.floor(Math.random() * 20) - 10;
  const scale = Math.random() * 0.4 + 0.8;
  const x = Math.floor(Math.random() * 40) - 20;
  const y = Math.floor(Math.random() * 40) - 20;

  card.style.transform = `rotate(${angle}deg) scale(${scale}) translate(${x}px, ${y}px)`;
  //card.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
  
});