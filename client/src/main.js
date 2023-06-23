import { version } from "../package.json";
import foo from "./foo.js";

foo(document);
console.log(version);

function toggle(r){
    if (r == -360) return 360;
    return -360;
}
var tvars = {
    duration: 10, 
    rotation: -360,
    ease: "none",
    repeat: -1,
    overwrite: true,
    onReverseComplete: () => {
        tl.clear();
        tvars['rotation'] = toggle(tvars['rotation']);
        console.log(tvars['rotation'])
        tween = tl.to(".contain", tvars);
        tween.play();
    }
}

var tl=gsap.timeline();
var tween = tl.to(".contain", tvars);

const fmt = new Intl.NumberFormat('en-US').format;
let start, raf;
let stop = false;
function frame(timestamp) {
    if (start == undefined) start = timestamp;

    const elapsed = timestamp - start;
    if (elapsed < Number.MAX_SAFE_INTEGER) {
        document.querySelector(".contain").innerHTML = fmt(~~(elapsed + .5)) + ' ms';
        if (!stop) raf = window.requestAnimationFrame(frame);
    }
}

document.querySelector(".contain").onclick = () => {
    cancelAnimationFrame(raf);
    start = undefined;
    tl.reversed( !tl.reversed() );
    raf = window.requestAnimationFrame(frame);
}

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
function draw_canvas(canvas){
    ctx.reset();
    let w = parseInt(window.getComputedStyle(canvas, null).getPropertyValue("width"));
    canvas.setAttribute('width', w);
    let h = parseInt(window.getComputedStyle(canvas, null).getPropertyValue("height"));
    canvas.setAttribute('height', h);
    ctx.fillStyle = "#141414";
    ctx.fillRect(50,50, w-100, h-100);

    ctx.strokeStyle = "#20BCE7";
    ctx.lineWidth = 10;
    ctx.strokeRect(45, 45, w-90, h-90);

    if (particles) {
        ctx.strokeStyle = "green";
        ctx.lineWidth = 1;
        particles.forEach((p)=>{
            ctx.strokeStyle = p.color.next();
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.radius, 75, Math.PI / 4, 0, 2 * Math.PI);
            ctx.stroke();
        })
    }
}

class range{
    constructor(low, high, step, begin){
        this.x = begin;
        if (begin == undefined) this.x = low;
        this.low = low;
        this.step = step;
        this.high = high;}
    next(){
        let x = this.x + this.step;
        if (x > this.high){
            this.step *= -1;
            let r = x - this.high
            this.x = this.high - r
            return this.x;
        }
        if (x<this.low){
            this.step *= -1;
            let r = this.low - x
            this.x = this.low + r;
            return this.x
        }
        this.x += this.step
        return this.x
    }
}

class Color{
    constructor(r, g, b){
        this.rgb = [
            new range(0,255,5,r),
            new range(0,255,5,g),
            new range(0,255,5,b)
        ];
    }
    next(){
        let _rgb = [];
        this.rgb.forEach((__)=> _rgb.push(__.next()));
        const [r, g, b] = _rgb;
        return `rgb(${r},${g},${b})` 
    }
}

class Particles{
    constructor(x, y, r, color){
        this.radius = new range(0, 50, 5)
        this.x = new range(x, x*10, 10,x*9);
        this.y = new range(y, y*3, 6);
        this.particles = new Array;
    }
    spawn(){
        this.particles.push({
            x: this.x.next(),
            y: this.y.next(),
            radius: this.radius.next(),
            color : new Color(5,200,40)
        });
    }
    forEach(f){
        this.particles.forEach(f)
    }
}
const particles = new Particles(100, 100, 50);

draw_canvas(canvas);
addEventListener('resize', (event) => draw_canvas(canvas));
addEventListener("keydown", (event) => {
    particles.spawn();
    draw_canvas(canvas);
});

