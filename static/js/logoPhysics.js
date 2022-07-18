
window.scroll(0, -window.pageYOffset);

const logo = $(".logo")[0];
const bounds = $(".logo-bounds")[0];
const logoTurnSpeed = 0.2;
const xForceDecay = 0.97;

let angle = 0;
let targetAngle = 0;
let bonusAngle = 0;
let logoClicks = 0;
let logoFalling = false;

let fallY = 0;
let fallForce = 0;
let fallTime = 0;

let xForce = 0;
let xPos = 0;

let xPadding = 48;

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
    if (logoFalling) {
        fallTime = 0;
        fallForce = 2;

        const rect = bounds.getBoundingClientRect();
        const x = e.clientX - (rect.x + rect.width / 2);
        xForce += x / 25;
    }
    const sign = Math.random() <= 0.5;
    bonusAngle += (Math.random() * 5 + 5) * (sign ? -1 : 1);
    if (!logoFalling) {
        logoClicks++;
        if (logoClicks == 10) {
            $(".speaker")[0].innerHTML = "I said not too much!"
        }
    }
    logoFalling = logoClicks >= 10;
};

const xOffset = Math.abs(bounds.getBoundingClientRect().x - xPos);
const yOffset = Math.abs(bounds.getBoundingClientRect().y - fallY);

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

    bounds.style.transform = `translateX(${xPos - logoClicks * 2}px) translateY(${fallY}px)`;
    logo.style.transform = `rotateZ(${angle + bonusAngle}deg)`;
    logo.style.filter = `drop-shadow(${logoClicks * 2}px 0px 0px rgba(198, 198, 198, 1)) ` +
                        `drop-shadow(15px 15px ${5 + logoClicks * 2}px rgba(65, 65, 119, ` +
                        `${Math.max(0, 1 - logoClicks / 14)}))`;
    
    if (logoFalling) {
        fallForce -= 9 * fallTime * fallTime;

        const scrollTop = document.documentElement.scrollTop;

        const w = $(window);
        const rect = bounds.getBoundingClientRect();
        const wWidth = w.width();
        const wHeight = w.height() + w.scrollTop();
        const x = rect.left;
        const y = rect.top + w.scrollTop();
        if (y + rect.height > wHeight) {
            fallY = wHeight - yOffset - rect.height;
            fallTime = 0;
        } else if (y + rect.height < wHeight 
                   || fallForce > 0) {
            fallY = Math.min(wHeight - rect.height - yOffset, fallY - fallForce * dt);
        }

        if (x + xPadding < 0) {
            xPos = 30 - xPadding - xOffset;
            xForce /= 2;
            xForce = -Math.abs(xForce);
        } else if (x + rect.width - xPadding + 20 > wWidth) {
            xPos = wWidth - xOffset - rect.width + xPadding - 20;
            xForce /= 2;
            xForce = Math.abs(xForce);
        }
        xPos -= xForce * dt;
        
        xForce *= Math.pow(xForceDecay, dt);
    
        fallTime += dt / 1000;
        fallTime = Math.min(fallTime, 1);
    }
}, 0);
