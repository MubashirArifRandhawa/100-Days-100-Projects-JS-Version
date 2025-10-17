const memoryButton = document.querySelector('#memoryButton');
const memoryLane = document.querySelector('#memoryLane');
const gallery = document.querySelector('.memory-gallery');
const heartsContainer = document.querySelector('.floating-hearts');
const starfield = document.querySelector('#starfield');

const memories = [
  {
    title: 'Sunset Promises',
    description:
      'The evening we watched the sun melt into the sea and promised a lifetime of adventures.',
    image:
      'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Laughing in the Rain',
    description:
      'When the rainstorm found us dancing barefoot in the street, laughing like teenagers.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'First Snowfall Escape',
    description:
      'Our spontaneous road trip into the mountains, warmed only by cocoa and your smile.',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Kitchen Serenade',
    description:
      'The midnight snacks, spinning you around the kitchen to our song on repeat.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Beachside Fireworks',
    description:
      'Cotton candy skies and fireworks echoing the spark in your eyes.',
    image:
      'https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Wanderlust Souls',
    description:
      'Maps, passports, and the thrill of exploring the world hand-in-hand.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
  },
];

function createMemoryCards() {
  const fragment = document.createDocumentFragment();

  memories.forEach((memory, index) => {
    const card = document.createElement('article');
    card.className = 'memory-card';
    card.style.transitionDelay = `${index * 0.1}s`;

    const img = document.createElement('img');
    img.src = memory.image;
    img.alt = `${memory.title} photo`;

    const heading = document.createElement('h3');
    heading.textContent = memory.title;

    const description = document.createElement('p');
    description.textContent = memory.description;

    card.append(img, heading, description);
    fragment.append(card);
  });

  gallery.append(fragment);
}

function revealMemories() {
  memoryLane.classList.add('is-visible');
  memoryLane.setAttribute('aria-hidden', 'false');
  memoryButton?.setAttribute('aria-expanded', 'true');

  document.querySelectorAll('.memory-card').forEach((card) => {
    requestAnimationFrame(() => {
      card.classList.add('is-visible');
    });
  });

  // unleash starburst
  unleashStarburst();
}

function hideMemories() {
  memoryLane.classList.remove('is-visible');
  memoryLane.setAttribute('aria-hidden', 'true');
  memoryButton?.setAttribute('aria-expanded', 'false');

  document
    .querySelectorAll('.memory-card')
    .forEach((card) => card.classList.remove('is-visible'));
}

memoryButton?.addEventListener('click', () => {
  if (!memoryLane.classList.contains('is-visible')) {
    revealMemories();
    if (memoryButton) {
      memoryButton.textContent = 'Replay the Magic';
    }
  } else {
    hideMemories();
    setTimeout(() => {
      void memoryLane.offsetHeight;
      revealMemories();
    }, 400);
  }
});

function spawnHearts() {
  const heart = document.createElement('div');
  heart.className = 'heart-shape';
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${6 + Math.random() * 6}s`;
  heart.style.opacity = `${0.3 + Math.random() * 0.5}`;
  heartsContainer.append(heart);

  setTimeout(() => heart.remove(), 12000);
}

function setupHearts() {
  for (let i = 0; i < 18; i += 1) {
    setTimeout(spawnHearts, i * 600);
  }
  setInterval(spawnHearts, 1200);
}

function unleashStarburst() {
  if (!starfield) return;
  const ctx = starfield.getContext('2d');
  starfield.width = window.innerWidth;
  starfield.height = window.innerHeight;

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * starfield.width,
    y: Math.random() * starfield.height,
    radius: Math.random() * 1.5 + 0.5,
    hue: Math.floor(Math.random() * 40) + 320,
    alpha: Math.random() * 0.5 + 0.4,
    velocity: Math.random() * 1.5 + 0.5,
  }));

  let animationFrame;
  let frame = 0;

  function animate() {
    frame += 1;
    ctx.clearRect(0, 0, starfield.width, starfield.height);

    stars.forEach((star) => {
      const flicker = Math.sin(frame / (35 + star.velocity * 10));
      const radius = star.radius + flicker * 0.8;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${star.hue}, 100%, 70%, ${star.alpha})`;
      ctx.shadowColor = `hsla(${star.hue}, 100%, 75%, 0.7)`;
      ctx.shadowBlur = 12 + star.velocity * 3;
      ctx.arc(star.x, star.y, Math.max(radius, 0), 0, Math.PI * 2);
      ctx.fill();

      star.y -= star.velocity;
      star.x += Math.sin(frame / 25) * 0.2;

      if (star.y < -10) {
        star.y = starfield.height + 10;
        star.x = Math.random() * starfield.width;
      }
    });

    animationFrame = requestAnimationFrame(animate);
  }

  cancelAnimationFrame(animationFrame);
  animate();
}

function handleResize() {
  if (!starfield) return;
  starfield.width = window.innerWidth;
  starfield.height = window.innerHeight;
}

window.addEventListener('resize', handleResize);

createMemoryCards();
hideMemories();
setupHearts();
handleResize();
