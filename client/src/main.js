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
    let w = parseInt(window.getComputedStyle(canvas, null).getPropertyValue("width"));
    canvas.setAttribute('width', w);
    let h = parseInt(window.getComputedStyle(canvas, null).getPropertyValue("height"));
    canvas.setAttribute('height', h);
    ctx.fillStyle = "black";
    ctx.fillRect(50,50, w-100, h-100);

    ctx.strokeStyle = "magenta";
    ctx.lineWidth = 10;
    ctx.strokeRect(45, 45, w-90, h-90);
}
draw_canvas(canvas);
addEventListener('resize', (event) => draw_canvas(canvas));
