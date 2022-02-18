import { version } from "../package.json";
import foo from "./foo.js";
var g = gsap;

foo(document);
console.log(version);

var tl=gsap.timeline();

function toggle(r){
    if (r == -360) return 360;
    return -360;
}

var tvars = {
    duration: 4, 
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

var tween = tl.to(".contain", tvars);
document.querySelector(".contain").onclick = () => {
    tl.reversed( !tl.reversed() );
}

console.log('build')
