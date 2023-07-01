import { version } from "../package.json";
import foo from "./foo.js";
import { range } from "./range.js";
foo(document);
console.log(version);

const fmt = new Intl.NumberFormat("en-US").format;
let start, raf;
let stop = false;

var particles;

function frame(timestamp) {
  if (start == undefined) start = timestamp;

  const elapsed = timestamp - start;
  if (elapsed < Number.MAX_SAFE_INTEGER) {
    document.querySelector(".status > p").innerHTML =
      fmt(~~(elapsed + 0.5)) + " ms";
    if (!stop) raf = window.requestAnimationFrame(frame);
  }
  particles.spawn();
  draw_canvas(canvas);
}

document.querySelector(".content").onclick = (e) => {

  particles = new Particles(100, 100);
  console.log(e);
  cancelAnimationFrame(raf);
  start = undefined;
  raf = window.requestAnimationFrame(frame);
  document.querySelector(".status").classList.add("running");
};

function draw_canvas(canvas) {
  ctx.reset();
  let w = canvas_width();
  canvas.setAttribute("width", w);
  let h = canvas_height();
  canvas.setAttribute("height", h);
  ctx.fillStyle = "#141414";
  ctx.fillRect(50, 50, w - 100, h - 100);

  ctx.strokeStyle = "#20BCE7";
  ctx.lineWidth = 10;
  ctx.strokeRect(45, 45, w - 90, h - 90);

  if (particles) {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1;
    particles.forEach((p) => {
      ctx.strokeStyle = p.color.next();
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.radius, 75, Math.PI / 4, 0, 2 * Math.PI);
      ctx.stroke();
    });
  }
}
class Color {
  constructor(r, g, b) {
    this.rgb = [
      new range(0, 255, 5, r),
      new range(0, 255, 5, g),
      new range(0, 255, 5, b),
    ];
  }
  next() {
    let _rgb = [];
    this.rgb.forEach((__) => _rgb.push(__.next()));
    const [r, g, b] = _rgb;
    return `rgb(${r},${g},${b})`;
  }
}

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let canvas_height = () =>
  parseInt(window.getComputedStyle(canvas, null).getPropertyValue("height"));
let canvas_width = () =>
  parseInt(window.getComputedStyle(canvas, null).getPropertyValue("width"));

class Particles {
  constructor(x, y) {
    this.radius = new range(0, 50, 5);
    this.x = new range(x, canvas_width() - 100, 10, x * 9);
    this.y = new range(y, canvas_height() - 100, 6);
    this.particles = new Array();
    this.max_len = 30;
  }
  spawn() {
    this.particles.push({
      x: this.x.next(),
      y: this.y.next(),
      radius: this.radius.next(),
      color: new Color(5, 200, 40),
    });
    if (this.particles.length > this.max_len) this.particles.shift();
  }
  forEach(f) {
    this.particles.forEach(f);
  }
}

draw_canvas(canvas);
addEventListener("resize", (event) => draw_canvas(canvas));
