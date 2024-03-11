//snow particle system
const snow = {
  el: '#snow',
  density: 40500, // higher = fewer bits
  maxHSpeed: 1, // How much do you want them to move horizontally
  minFallSpeed: 0.5,
  canvas: null,
  ctx: null,
  particles: [],
  colors: [],
  mp: 1,
  quit: false,
  paused: false,

  init() {
    this.quit = false;
    this.canvas = document.querySelector(this.el);
    this.ctx = this.canvas.getContext('2d');
    this.reset();
    requestAnimationFrame(this.render.bind(this));
    window.addEventListener('resize', this.reset.bind(this));
  },
  reset() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.particles = [];
    this.mp = Math.ceil((this.w * this.h) / this.density);
    for (let i = 0; i < this.mp; i++) {
      let size = Math.random() * 1.7 + 3;
      this.particles.push({
        x: Math.random() * this.w, //x-coordinate
        y: Math.random() * this.h, //y-coordinate
        w: size,
        h: size,
        vy: this.minFallSpeed + Math.random(), //density
        vx: Math.random() * this.maxHSpeed - this.maxHSpeed / 2,
        fill: '#ffffff',
        s: Math.random() * 0.2 - 0.1,
      });
    }
  },

  render() {
    if (this.paused) {
      return;
    }

    this.ctx.clearRect(0, 0, this.w, this.h);
    this.particles.forEach((p, i) => {
      p.y += p.vy;
      p.x += p.vx;
      this.ctx.fillStyle = p.fill;
      this.ctx.fillRect(p.x, p.y, p.w, p.h);
      if (p.x > this.w + 5 || p.x < -5 || p.y > this.h) {
        p.x = Math.random() * this.w;
        p.y = -10;
      }
    });
    if (this.quit) {
      return;
    }
    requestAnimationFrame(this.render.bind(this));
  },

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      // Pause actions
      this.quit = true; // Stop the animation loop
      // Additional pause logic if needed
    } else {
      // Resume actions
      this.quit = false; // Resume the animation loop
      requestAnimationFrame(this.render.bind(this));
      // Additional resume logic if needed
    }
  },

  destroy() {
    this.quit = true;
  },
};

//confetti particle system
const confetti = {
  el: '#confetti',
  density: 40000,
  maxHSpeed: 2.1, // Increase max horizontal speed
  minFallSpeed: 2, // Increase min fall speed
  canvas: null,
  ctx: null,
  particles: [],
  colors: ['#009CDE', '#ffffff'], // Blue and white colors
  mp: 1,
  quit: false,
  initialFall: true,

  init() {
    this.particles = [];
    this.quit = false;
    this.canvas = document.querySelector(this.el);
    this.ctx = this.canvas.getContext('2d');
    this.reset();
    requestAnimationFrame(this.render.bind(this));
    window.addEventListener('resize', this.reset.bind(this));
  },

  // Add a variable to control initial fall
  initialFall: false,

  reset() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.particles = [];
    // Not dense at the beginning, then regular density
    this.mp = 1000;

    for (let i = 0; i < this.mp; i++) {
      let size = 0;
      // Randomly choose between two size ranges
      if (Math.random() < 0.5) {
        size = Math.random() * 1.7 + 3; // Smaller particles
      } else {
        size = Math.random() * 2 + 4; // Bigger particles
      }

      // Randomly choose between two height ranges
      let heightMultiplier = 1;
      if (Math.random() < 0.5) {
        heightMultiplier = 2; // 2 times as high
      }

      let vy = this.initialFall ? 0 : this.minFallSpeed + Math.random();
      let y = this.initialFall
        ? Math.random() * this.h
        : Math.random() * -size * 140;
      let widthTransition = Math.random() > 0.5 ? 1 : 0.9; // Random width transition value (0 to 1)
      this.particles.push({
        x: Math.random() * this.w,
        y: y,
        w: size,
        h: size * heightMultiplier,
        vy: vy,
        vx: Math.random() * this.maxHSpeed - this.maxHSpeed / 2,
        fill: this.colors[Math.floor(Math.random() * this.colors.length)],
        s: Math.random() * 0.2 - 0.1,
        angle: Math.random() * 360, // Initialize the angle for rotation
        rotationSpeed: Math.random() * 1.75 - 0.25, // Initialize the rotation speed
        widthTransition: widthTransition,
      });
      this.initialFall = false;
    }
  },

  render() {
    this.ctx.clearRect(0, 0, this.w, this.h);

    this.particles.forEach((p, i) => {
      p.x += p.vx;
      // Apply rotation during the fall
      p.angle += p.rotationSpeed;
      p.y += p.vy; // Update the y-coordinate for falling

      // Calculate opacity based on the particle's vertical position
      const maxOpacity = 1;
      const minOpacity = 0;
      const opacityRange = maxOpacity - minOpacity;
      const normalizedY = p.y / this.h; // Normalize the y-coordinate
      const opacity = maxOpacity - normalizedY * opacityRange;

      // Calculate width based on width transition value
      const maxWidth = p.w;
      const minWidth = 0;
      const width = minWidth + p.widthTransition * (maxWidth - minWidth);

      // Add rotation to the particles
      this.ctx.save();
      this.ctx.translate(p.x + width / 2, p.y + p.h / 2);
      this.ctx.rotate((Math.PI / 180) * p.angle);
      this.ctx.globalAlpha = opacity;
      this.ctx.fillStyle = p.fill;
      this.ctx.fillRect(-width / 2, -p.h / 2, width, p.h);
      this.ctx.restore();

      if (p.x > this.w + 5 || p.x < -5 || p.y > this.h) {
        p.x = Math.random() * this.w;
        p.y = -10;
      }
    });

    if (this.quit) {
      return;
    }
    requestAnimationFrame(this.render.bind(this));
  },

  destroy() {
    this.quit = true;
  },
};

export { confetti, snow };
