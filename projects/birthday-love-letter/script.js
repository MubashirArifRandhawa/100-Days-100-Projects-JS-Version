const heartsContainer = document.querySelector('.floating-hearts');
const starfield = document.querySelector('#starfield');
const memoryButton = document.querySelector('#memoryButton');
const gallery = document.querySelector('[data-gallery]');

function spawnHearts() {
  if (!heartsContainer) return;

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

  function resizeCanvas() {
    starfield.width = window.innerWidth;
    starfield.height = window.innerHeight;
  }

  resizeCanvas();

  const stars = Array.from({ length: 140 }, () => ({
    x: Math.random() * starfield.width,
    y: Math.random() * starfield.height,
    radius: Math.random() * 1.4 + 0.4,
    hue: Math.floor(Math.random() * 40) + 320,
    alpha: Math.random() * 0.5 + 0.4,
    velocity: Math.random() * 1.5 + 0.6,
  }));

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

    requestAnimationFrame(animate);
  }

  animate();
  window.addEventListener('resize', resizeCanvas);
}

function createMemoryCard(memory, index) {
  const article = document.createElement('article');
  article.className = 'memory-card';
  article.style.setProperty('--card-index', index);

  const figure = document.createElement('figure');
  figure.className = 'memory-card__media';

  const image = document.createElement('img');
  image.loading = 'lazy';
  image.src = memory.image;
  image.alt = memory.alt ?? `${memory.title} photograph`;

  const figcaption = document.createElement('figcaption');
  figcaption.className = 'memory-card__caption';
  figcaption.innerHTML = `
    <h4>${memory.title}</h4>
    <p>${memory.description}</p>
    ${
      memory.meta
        ? `<span class="memory-card__meta">${memory.meta}</span>`
        : ''
    }
  `;

  figure.append(image, figcaption);
  article.append(figure);

  return article;
}

function populateGallery() {
  if (!gallery) return [];

  const data = Array.isArray(window.MEMORY_DATA) ? window.MEMORY_DATA : [];

  if (data.length === 0) {
    const fallback = document.createElement('p');
    fallback.className = 'memory-empty';
    fallback.textContent =
      'Add your photos inside public/images and update public/memory-data.js to see them glow here!';
    gallery.append(fallback);
    return [];
  }

  const fragment = document.createDocumentFragment();
  const cards = data.map((memory, index) => {
    const card = createMemoryCard(memory, index);
    fragment.append(card);
    return card;
  });

  gallery.append(fragment);
  return cards;
}

function setupRevealAnimations(cards) {
  if (!gallery || !cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  cards.forEach((card) => observer.observe(card));
}

function setupTilt() {
  if (!gallery) return;
  if (window.matchMedia('(hover: none)').matches) return;

  gallery.addEventListener('pointermove', (event) => {
    const target = event.target.closest('.memory-card');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -12;
    target.style.setProperty('--tilt-x', `${rotateX}deg`);
    target.style.setProperty('--tilt-y', `${rotateY}deg`);
  });

  gallery.addEventListener('pointerleave', () => {
    gallery.querySelectorAll('.memory-card').forEach((card) => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });
}

function enableMemoryScroll() {
  if (!memoryButton) return;

  memoryButton.addEventListener('click', (event) => {
    const targetId = memoryButton.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;

    const section = document.querySelector(targetId);
    if (!section) return;

    event.preventDefault();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    section.classList.add('is-highlighted');
    setTimeout(() => section.classList.remove('is-highlighted'), 1200);
  });
}

setupHearts();
unleashStarburst();
enableMemoryScroll();

const memoryCards = populateGallery();
setupRevealAnimations(memoryCards);
setupTilt();
