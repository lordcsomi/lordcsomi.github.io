const grid = document.getElementById('grid');
const letters = 'abcdefghijklmnopqrstuvwxyz';
const gridSize = 60;
const letterSize = 18;
const letterColors = ['#ff0000', '#00ff00', '#0000ff'];
const radius = 45;

// Populate the grid with letters
for (let i = 0; i < gridSize * gridSize; i++) {
  const letter = document.createElement('div');
  letter.innerText = letters.charAt(Math.floor(Math.random() * letters.length));
  letter.style.fontSize = `${letterSize}px`;
  letter.style.color = '#999';
  grid.appendChild(letter);
}

// on mousemove, change the color of the letters under the mouse in a radius and the ones that are not in the radius to back to the original color
document.addEventListener('mousemove', (e) => {
    const letters = document.querySelectorAll('#grid div');
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const x = letter.offsetLeft + letterSize / 2;
        const y = letter.offsetTop + letterSize / 2;
        const distance = Math.sqrt(Math.pow(e.clientX - x, 2) + Math.pow(e.clientY - y, 2));
        if (distance < radius) {
        letter.style.color = letterColors[Math.floor(Math.random() * letterColors.length)];
        } else {
        letter.style.color = '#999';
        }
    }
    });

// on mouseleave, change the color of the letters back to the original color
document.addEventListener('mouseleave', () => {
    const letters = document.querySelectorAll('#grid div');
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        letter.style.color = '#999';
    }
});

// on resize, change the size of the letters
window.addEventListener('resize', () => {
    const letters = document.querySelectorAll('#grid div');
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        letter.style.fontSize = `${letterSize}px`;
    }
});

// on click, from the mouse position, while the radius not exceed a given max radious, change the color of the letters on the perimeter of the radius and the ones that are not on the perimetr of the radius back to original color and increase the radius in every 100ms
document.addEventListener('click', (e) => {
    const letters = document.querySelectorAll('#grid div');
    let radius = 0;
    const interval = setInterval(() => {
        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i];
            const x = letter.offsetLeft + letterSize / 2;
            const y = letter.offsetTop + letterSize / 2;
            const distance = Math.sqrt(Math.pow(e.clientX - x, 2) + Math.pow(e.clientY - y, 2));
            if (distance < radius) {
            letter.style.color = letterColors[Math.floor(Math.random() * letterColors.length)];
            } else {
            letter.style.color = '#999';
            }
        }
        radius += 5;
        if (radius > 100) {
            clearInterval(interval);
        }
    }, 30);
});