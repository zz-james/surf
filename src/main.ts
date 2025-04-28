import {
  createParticleExplosion,
  drawParticles,
  updateParticles,
} from "./particles.ts";
import { Surface } from "./surface.ts";
import * as g from "./globals.ts";

const screen: Surface = new Surface(g.SCREEN_WIDTH, g.SCREEN_HEIGHT);

// createParticleExplosion(100, 100, 255, 255, 255, 10, 30);
// createParticleExplosion(100, 100, 255, 0, 0, 5, 10);
// createParticleExplosion(100, 100, 255, 255, 0, 2, 5);


  

const canvas = document.createElement("canvas");
canvas.width = g.SCREEN_WIDTH;
canvas.height = g.SCREEN_HEIGHT;
document.body.appendChild(canvas);

let count = 0;

const loop = () => {
  screen.clearPixels();
  updateParticles();
  drawParticles(screen, 0, 0);
  screen.blitToCanvas(canvas);

  if (count < 5000) {
    count++;
    window.requestAnimationFrame(loop);
  }
}; // Update the particles


document.addEventListener('mousedown', (e)=>{
  // console.log(e.clientX, e.clientY)

  createParticleExplosion(e.clientX, e.clientY, 255, 255, 255, 15, 300);
  createParticleExplosion(e.clientX, e.clientY, 255, 0, 0, 10, 100);
  createParticleExplosion(e.clientX, e.clientY, 255, 255, 0, 5, 50);
loop();
})