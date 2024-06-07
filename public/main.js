import YapheEngine from "../src/engine.js";


const hamburger = document.querySelector("#hamburger");
const navbar = document.querySelector("#nav-bar");
const hamburgerImg = document.querySelector("#hamburger-img");
const mobileNavPopup = document.querySelector("#mobile-nav-popup");
const exampleDisplay = document.querySelector("#example-display");

hamburger.onclick = () => {
    const hamburgerImgSvg = hamburgerImg.src.split("/");
    const imgName =  hamburgerImgSvg[hamburgerImgSvg.length - 1];
    if (imgName == "hamburger.svg") {
        mobileNavPopup.classList.add("slide-from-top");
        mobileNavPopup.classList.remove("slide-to-top");
        navbar.classList.add("nav-active");
        hamburgerImg.src = `${hamburgerImg.src.replace("hamburger.svg", "x.svg")}`;
    } else {
        mobileNavPopup.classList.remove("slide-from-top");
        mobileNavPopup.classList.add("slide-to-top");
        navbar.classList.remove("nav-active");
        hamburgerImg.src = `${hamburgerImg.src.replace("x.svg", "hamburger.svg")}`;
    }
    
}

function openAccordion(accordionName) {
    const elements = document.querySelectorAll(`[data-accordion-name="${accordionName}"]`);
    elements.forEach((element) => {
        if (element.tagName == "IMG") {
            element.src = element.src.endsWith("chevron-down.svg") ? "./public/assets/img/chevron-up.svg" : "./public/assets/img/chevron-down.svg";
        } else if (element.tagName == "DIV") {
            // console.log(element.style.height)
            // element.style.display = (element.style.display === "none") ? "block" : "none";
            element.classList.toggle("collapse-vertically");
            element.classList.toggle("expand-vertically");
            // element.style.height = (element.style.height === "0px") ? "auto" : "0px";
            // element.style.padding = (element.style.padding === "0px") ? "var(--small-gap)" : "0px";
        }
    })
}

function openExample(src) {
    exampleDisplay.src = src;
}


const sliders = document.querySelectorAll(".slider");
const slidersCallback = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            slidersObserver.unobserve(entry.target);
        } else {
            entry.target.classList.remove("visible");
        }
    })
}

const slidersOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.0
}

const slidersObserver = new IntersectionObserver(slidersCallback, slidersOptions);

sliders.forEach((slider) => {
    slidersObserver.observe(slider);
})

const engine = new YapheEngine({element: "#yaphe-simulation"});
const chainWorld = engine.createWorld2D();
chainWorld.boundaryBehavior = "none";
chainWorld.createCanvas();
const a = chainWorld.createParticle2D(chainWorld.center.x - 200, chainWorld.center.y);
const b = chainWorld.createParticle2D(chainWorld.center.x - 150, chainWorld.center.y);
const c = chainWorld.createParticle2D(chainWorld.center.x - 100, chainWorld.center.y);
const d = chainWorld.createParticle2D(chainWorld.center.x - 50, chainWorld.center.y);
const e = chainWorld.createParticle2D(chainWorld.center.x, chainWorld.center.y);
const particles = [a, b, c, d, e];
particles.forEach((particle) => {
    particle.isPoint = true;
})
const chains = []
for(let i = 0; i < particles.length - 1; i++) {
    const chain = chainWorld.createConstraint2D(particles[i], particles[i + 1]);
    chain.style.strokeColor = "white";
    chains.push(chain);
}
a.fixed = true;
// chains[0].visible = false;
document.onmousemove = (e) => {
    a.position.x = e.clientX + 8;
    a.position.y = e.clientY + 17;
}
engine.ignite();

window.onload = () => {
    document.querySelectorAll(`[data-accordion-name]`).forEach((element) => {
        if (element.tagName == "DIV") {
            // console.log(element.style.height)
            element.classList.add("collapse-vertically");
            // element.style.height = (element.style.height === "0px") ? "auto" : "0px";
            // element.style.padding = (element.style.padding === "0px") ? "var(--small-gap)" : "0px";
        }
    })
}