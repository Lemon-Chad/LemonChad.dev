
window.scroll(0, -window.pageYOffset);

const logo = $(".logo")[0];
const bounds = $(".logo-bounds")[0];
const logoTurnSpeed = 0.2;

let angle = 0;
let targetAngle = 0;
let bonusAngle = 0;

logo.onmouseenter = e => {
    const sign = Math.random() <= 0.5;
    targetAngle = Math.random() * 2 + 2;
    targetAngle *= sign ? 1 : -1;
};

logo.onmouseleave = e => {
    targetAngle = 0;
};

for (const img of $("img"))
    img.ondragstart = () => false;

logo.onmousedown = e => {
    const sign = Math.random() <= 0.5;
    bonusAngle += (Math.random() * 5 + 5) * (sign ? -1 : 1);
};

let t = Date.now();
const logoInterval = setInterval(() => {
    let dt = Date.now() - t;
    
    t += dt;
    dt /= 5;
    
    if (angle < targetAngle) {
        angle = Math.min(targetAngle, angle + logoTurnSpeed);
    } else if (angle > targetAngle) {
        angle = Math.max(targetAngle, angle - logoTurnSpeed);
    }

    if (bonusAngle < 0) {
        bonusAngle = Math.min(0, bonusAngle + logoTurnSpeed);
    } else if (bonusAngle > 0) {
        bonusAngle = Math.max(0, bonusAngle - logoTurnSpeed);
    }

    logo.style.transform = `rotateZ(${angle + bonusAngle}deg)`;
}, 0);
