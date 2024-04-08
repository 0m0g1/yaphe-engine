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