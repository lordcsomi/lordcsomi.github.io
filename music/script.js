const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  const angle = Math.floor(Math.random() * 20) - 10;
  const scale = Math.random() * 0.4 + 0.9;
  const x = Math.floor(Math.random() * 40) - 20;
  const y = Math.floor(Math.random() * 40) - 20;

  card.style.transform = `rotate(${angle}deg) scale(${scale}) translate(${x}px, ${y}px)`;
  //card.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
  
});

const title = document.querySelector('.title-container');
const container = document.querySelector('.container');

setTimeout(() => {
  title.style.opacity = '0'; /* change this line */
  container.style.display = 'flex';
  setTimeout(() => {
    title.style.display = 'none';
  }, 2000); /* add this line */
}, 2000);