import { Surface } from "./surface.ts";
import * as g from "./globals.ts";

type Particle_t = {
  x: number;
  y: number /* coordinates of the particle */;
  energy: number /* velocity of the particle */;
  angle: number /* angle of the particle */;
  r: number;
  g: number;
  b: number /* color */;
};

const particles: Particle_t[] = []; // up to MAX_PARTICLES items

// let timeScale = 0.1; // for now

let activeParticles: number = 0;

const addParticle = (particle: Particle_t) => {
  /* if there are too many particles, forget it */
  if (activeParticles >= g.MAX_PARTICLES) return;
  particles[activeParticles] = particle;
  activeParticles++;
};

const deleteParticle = (index: number) => {
  /* replace the particle with the one at the end of the list and shorten the list */
  particles[index] = particles[activeParticles - 1];
  activeParticles--;
};

export const drawParticles = (
  dest: Surface,
  cameraX: number,
  cameraY: number
): void => {
  let pixels: Uint8ClampedArray = dest.pixels; // each pixel is 4 * 8 bit unsigned integer (32 bits)

  for (let i = 0; i < activeParticles; i++) {
    let x: number;
    let y: number;
    let color: Uint8ClampedArray; // a 4 item Uint8ClapedArray representing one 32 bit pixel

    x = particles[i].x - cameraX;
    y = particles[i].y - cameraY;

    if (x < 0 || x >= dest.width) continue;
    if (y < 0 || y >= dest.height) continue;

    /* find the color of this particle */
    color = createPixel(particles[i].r, particles[i].g, particles[i].b);

    pixels.set(color, dest.getIndex(x, y));
  }
};

export const updateParticles = (): void => {
  for (let i = 0; i < activeParticles; i++) {
    const angle = particles[i].angle;
    particles[i].x +=
      (particles[i].energy * Math.cos(angle * (Math.PI / 180))) | 0;
    particles[i].y +=
      (particles[i].energy * -Math.sin(angle * (Math.PI / 180))) | 0;

    /* fade the particles color */
    particles[i].r--;
    particles[i].g--;
    particles[i].b--;

    if (particles[i].r < 0) particles[i].r = 0;
    if (particles[i].g < 0) particles[i].g = 0;
    if (particles[i].b < 0) particles[i].b = 0;

    if (particles[i].r + particles[i].g + particles[i].b === 0) {
      deleteParticle(i);
      // deleted particle replaces the current particle with the one at the end of the list
      // so we need to take a step back
      i--;
    }
  }
};

export const createParticleExplosion = (
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  energy: number,
  density: number
): void => {
  let particle: Particle_t;

  for (let i = 0; i < density; i++) {
    particle = {
      x,
      y,
      angle: ((Math.random() * 1028) | 0) % 360,
      energy: ((Math.random() * 1028) | 0) % (((energy * 1000) / 1000) | 0),
      r,
      g,
      b,
    };
    addParticle(particle);
  }
};

const createPixel = (
  red: number,
  green: number,
  blue: number
): Uint8ClampedArray => {
  return new Uint8ClampedArray([red, green, blue, 255]);
};
