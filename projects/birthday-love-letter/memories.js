const starfield = document.querySelector('#starfield');
const gallery = document.querySelector('[data-gallery]');

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
    <h3>${memory.title}</h3>
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
  if (!gallery) return;

  const data = window.MEMORY_DATA ?? [];

  if (!Array.isArray(data) || data.length === 0) {
    const fallback = document.createElement('p');
    fallback.className = 'memory-empty';
    fallback.textContent =
      'Add your photos inside public/images and update public/memory-data.js to see them glow here!';
    gallery.append(fallback);
    return;
  }

  const fragment = document.createDocumentFragment();

  data.forEach((memory, index) => {
    const card = createMemoryCard(memory, index);
    fragment.append(card);
  });

  gallery.append(fragment);
}

function setupRevealAnimations() {
  if (!gallery) return;

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

  gallery.querySelectorAll('.memory-card').forEach((card) => {
    observer.observe(card);
  });
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

function unleashStarburst() {
  if (!starfield) return;
  const ctx = starfield.getContext('2d');

  function resizeCanvas() {
    starfield.width = window.innerWidth;
    starfield.height = window.innerHeight;
  }

  resizeCanvas();

  const stars = Array.from({ length: 160 }, () => ({
    x: Math.random() * starfield.width,
    y: Math.random() * starfield.height,
    radius: Math.random() * 1.8 + 0.4,
    hue: Math.floor(Math.random() * 60) + 280,
    alpha: Math.random() * 0.5 + 0.4,
    velocity: Math.random() * 1.8 + 0.6,
  }));

  let frame = 0;

  function animate() {
    frame += 1;
    ctx.clearRect(0, 0, starfield.width, starfield.height);

    stars.forEach((star) => {
      const flicker = Math.sin(frame / (30 + star.velocity * 10));
      const radius = star.radius + flicker * 0.9;

      ctx.beginPath();
      ctx.fillStyle = `hsla(${star.hue}, 100%, 70%, ${star.alpha})`;
      ctx.shadowColor = `hsla(${star.hue}, 100%, 75%, 0.7)`;
      ctx.shadowBlur = 14 + star.velocity * 3;
      ctx.arc(star.x, star.y, Math.max(radius, 0), 0, Math.PI * 2);
      ctx.fill();

      star.y -= star.velocity * 0.6;
      star.x += Math.sin(frame / 18) * 0.4;

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

populateGallery();
setupRevealAnimations();
setupTilt();
unleashStarburst();
