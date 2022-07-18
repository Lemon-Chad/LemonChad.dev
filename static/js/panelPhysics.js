
window.scroll(0, -window.pageYOffset);

let mousedx, mousedy;
let mouseX, mouseY;

let mouseStartedMoving = false;
let mouseMoved = false;
const MINIMUM_MOUSE_MOVE_TIME = 0;

let anger = 0;

setInterval(() => { 
   if(!mouseMoved && mouseStartedMoving) {
       mousedx = 0;
       mousedy = 0;
       mouseStartedMoving = false;
   }
   mouseMoved = false;
}, MINIMUM_MOUSE_MOVE_TIME);

document.onmousemove = e => {
    mousedx = e.clientX - mouseX;
    mousedy = e.clientY - mouseY;

    mouseX = e.clientX;
    mouseY = e.clientY;

    mouseStartedMoving = true;
    mouseMoved = true;
};

function panel(element, bounds) {
    let clicked = false;
    let released = false;
    
    let broken = false;
    let shakes = 0;
    
    let xPos = 0;
    let yPos = 0;

    let fallTime = 0;
    let fallForce = 0;
    let xForce = 0;

    let dx = 0;
    let dy = 0;

    let clickX = 0;
    let clickY = 0;
    let clickScroll = 0;

    let stillTimer = 0;

    const xOffset = Math.abs(bounds.getBoundingClientRect().x - xPos);
    const yOffset = Math.abs(bounds.getBoundingClientRect().y - yPos);
    
    element.onmousedown = e => {
        clicked = true;
        const rect = bounds.getBoundingClientRect();
        const w = $(window);
        clickScroll = w.scrollTop();
        clickX = e.clientX - rect.x;
        clickY = e.clientY - rect.y - clickScroll;
    };

    element.onmouseleave = e => {
        clicked &= broken;
    };

    addEventListener('mouseup', e => {
        clicked = false;
        released = true;
    });

    addEventListener('scroll', e => {
        const w = $(window);
        const d = w.scrollTop() - clickScroll;
        clickY -= d;
        clickScroll = w.scrollTop();
    });

    let t = Date.now();
    setInterval(() => {
        let dt = Date.now() - t;
        
        t += dt;
        dt /= 5;
        stillTimer--;
        
        bounds.style.transform = `translateX(${xPos}px) translateY(${yPos}px)`;
        element.style.transform = `rotateZ(${dx / window.innerWidth * 1000}deg)`;

        const w = $(window);
        const rect = bounds.getBoundingClientRect();
        const wWidth = w.width();
        const wHeight = w.height() + w.scrollTop();
        const x = rect.left;
        const y = rect.top + w.scrollTop();
        
        let nXPos = xPos;
        let nYPos = yPos;
        if (broken) {
            if (clicked) {
                if (mouseX - clickX < 0) {
                    nXPos = -Math.abs(nXPos - x);
                } else if (mouseX - clickX + rect.width > wWidth) {
                    nXPos = wWidth - xOffset - rect.width;
                } else {
                    nXPos = mouseX - xOffset - clickX;
                }

                if (mouseY - clickY + rect.height > wHeight) {
                    nYPos = wHeight - yOffset - rect.height;
                } else {
                    nYPos = mouseY - yOffset - clickY;
                }
                
                fallTime = 0.01;
                fallForce = 0;
            } else if (released) {
                fallForce = -dy / 5;
                xForce = dx;
            } else {
                fallTime += dt / 1000;
                fallTime = Math.min(fallTime, 1);
                fallForce -= 2 * fallTime * fallTime;
            }
        } else if (clicked) {
            const centerX = x + rect.width / 2;
            if (mouseX < centerX) {
                nXPos = -shakes / 5;
            } else {
                nXPos = shakes / 5;
            }

            if ((shakes % 2 == 1 && mouseX < centerX) || 
                (shakes % 2 == 0 && mouseX > centerX)) {
                shakes++;
            }

            if (shakes == 15) {
                broken = true;
                
                clickScroll = w.scrollTop();
                clickX = mouseX - x;
                clickY = mouseY - y;
                
                anger++;
                let phrase;
                switch (anger) {
                    case 1:
                        phrase = "Really!?";
                        break;
                    case 2:
                        phrase = "Come on!!";
                        break;
                    case 3:
                        phrase = "Why are you doing this to me.";
                        break;
                    default:
                        phrase = "I don't understand!";
                        break;
                }
                $(".speaker")[0].innerHTML = phrase;
            }
        } else {
            nXPos = 0;
            shakes = 0;
        }

        if (y + rect.height > wHeight) {
            nYPos = wHeight - yOffset - rect.height;
            fallTime = 0;
        } else if (y + rect.height < wHeight || fallForce > 0) {
            nYPos = Math.min(wHeight - rect.height - yOffset, nYPos - fallForce * dt);
        }

        if (x < 0) {
            nXPos = -Math.abs(nXPos - x);
            xForce *= -1 / 2;
        } else if (x + rect.width > wWidth) {
            nXPos = wWidth - xOffset - rect.width;
            xForce *= -1 / 2;
        } else if (x >= 0 && x + rect.width <= wWidth) {
            nXPos += xForce * dt;
        }

        if (Math.abs(nXPos - xPos) > 1) {
            dx = (nXPos - xPos) / 2;
            stillTimer = 3;
        } else if (stillTimer <= 0) {
            dx = 0;
        }
        
        if (Math.abs(nYPos - yPos) > 1) {
            dy = (nYPos - yPos) / 2;
            stillTimer = 3;
        } else if (stillTimer <= 0) {
            dy = 0;
        }
        
        xPos = nXPos;
        yPos = nYPos;
        released = false;
        xForce *= Math.pow(0.97, dt);
    }, 0);
}

for (let i = 1; i <= 3; i++) {
    panel($(`.panel${i}`)[0], $(`.panel${i}-container`)[0]);
}
