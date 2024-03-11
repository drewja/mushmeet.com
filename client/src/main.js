import {
    version
} from "../package.json";
import foo from "./foo.js";
import {
    rangeBounce
} from "./range.js";
foo(document);
/* TODO: refactor */
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
    let cx = e.offsetX;
    let cy = e.offsetY;
    particles = new Particles(cx, cy);
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
    ctx.fillRect(10, 10, w - 20, h - 20);

    ctx.strokeStyle = "#20BCE7";
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, w - 10, h - 10);

    if (particles) {
        window.particles = particles;
        ctx.lineWidth = 1;
        particles.forEach((p) => {
            ctx.strokeStyle = p.color.next();
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.radius, p.radius, Math.PI / 4, 0, 2 * Math.PI);
            ctx.stroke();
        });
        let ps = particles.particles;
        let p = ps[ps.length - 1];
        ctx.beginPath();
        ctx.fillStyle = "rgba(36, 25, 116, .68)";
        ctx.ellipse(p.x, p.y, p.radius, p.radius, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
    }
}
class Color {
    constructor(r, g, b) {
        this.rgb = [
            rangeBounce(0, 255, 5, r),
            rangeBounce(0, 255, 5, g),
            rangeBounce(0, 255, 5, b),
        ];
    }
    next() {
        let v = [];
        this.rgb.forEach((f) => v.push(f()));
        const [r, g, b] = v;
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
        this.w = canvas_width();
        this.h = canvas_height();
        let w = this.w;
        let h = this.h;
        //this.radius = rangeBounce(2, 30, 1, 30);
        this.radius = () => 100;
        this.x = rangeBounce(this.radius(), w - this.radius(), w / h, x);
        this.y = rangeBounce(0, h, h / w, y)
        this.particles = new Array();
        this.max_len = 2000;
    }
    spawn() {
        let x = this.x();
        this.particles.push({
            x: x,
            //    y: Math.sin(x) + (this.h/2),
            y: this.h / 2 + Math.sin(x * .01) * (this.h / 2 - this.radius()),
            radius: this.radius(),
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

window.canvas = canvas;
