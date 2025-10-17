const heartsContainer = document.querySelector('.floating-hearts');
const starfield = document.querySelector('#starfield');

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

setupHearts();
unleashStarburst();
