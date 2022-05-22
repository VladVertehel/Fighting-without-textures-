// ___________________________________________________

// CANVAS

// Canvas variables
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// Canvas size
canvas.width = 1024;
canvas.height = 576;

// Background
context.fillStyle = '#1ED6F7';
context.fillRect(0, 0, canvas.width, canvas.height);

// CANVAS

// ___________________________________________________

// PLAYERS

// Gravity for falling down
let gravity = 0.7;
// Players sprites
class Sprite {
    // Position variable
    constructor({ position, speed, color = 'orange', weaponColor = 'green', offset } /*This object is designed to make it easier to access values(position, speed etc.*/) {
        this.position = position;
        this.speed = speed;
        this.height = 150;
        this.width = 50;
        this.lastKey; // This is need when both of directions are pressed
        this.jumpCount = 0;
        this.color = color;
        this.weaponColor = weaponColor;
        this.attackBox = {
            position: this.position,
            height: 20,
            width: 125,
            offset
        };
        this.isAttacking = false;
        this.health = 100;
    }

    // Function for drawing players and weapons
    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);

        if (this.isAttacking) {
            context.fillStyle = this.weaponColor;
            context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }

    }

    update() {
        this.draw()

        this.attackBox.position = {
            x: this.position.x + 25 - this.attackBox.offset.x,
            y: this.position.y + 50
        };

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        if (this.position.y + this.height + this.speed.y >= canvas.height) {
            this.speed.y = 0;
        } else { this.speed.y += gravity; }

        if (this.position.y <= 0) {
            this.speed.y = 1;
        }

        if (this.position.x >= canvas.width - 50) {
            this.position.x = canvas.width - 50;
        } else if (this.position.x <= 0) {
            this.position.x = 0;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 200);
    }
}
// Creating players' positions
const player = new Sprite({
    // Position object
    position: {
        x: 50,
        y: 70
    },
    // Speed object (no moving by default)
    speed: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
});

const enemy = new Sprite({
    position: {
        x: canvas.width - 100,
        y: 70
    },
    speed: {
        x: 0,
        y: 0
    },
    color: 'white',
    weaponColor: 'black',
    offset: {
        x: 125,
        y: 0
    }
});

// Key-checking object
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
}

// RectangularColission
function RectangularColission({
    rectangular1, rectangular2
}) {
    if (rectangular1.attackBox.width > 0) {
        return (rectangular1.attackBox.position.x + rectangular1.attackBox.width >= rectangular2.position.x
            && rectangular1.attackBox.position.x <= rectangular2.position.x + rectangular2.width
            && rectangular1.attackBox.position.y + rectangular1.attackBox.height >= rectangular2.position.y
            && rectangular1.attackBox.position.y <= rectangular2.position.y + rectangular2.height)
    } else {
        return (rectangular1.attackBox.position.x + rectangular1.attackBox.width <= rectangular2.position.x + rectangular2.width
            && rectangular1.attackBox.position.x >= rectangular2.position.x
            && rectangular1.attackBox.position.y + rectangular1.attackBox.height >= rectangular2.position.y
            && rectangular1.attackBox.position.y <= rectangular2.position.y + rectangular2.height)
    }
}

// Drawing and animating players
function animate() {
    window.requestAnimationFrame(animate);
    // Drawing field in every frame so that there is an animation of movement and not drawing by characters
    context.fillStyle = '#1ED6F7';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.speed.x = 0;

    if (keys.d.pressed && player.lastKey === 'd') {
        player.speed.x = 5;
        player.attackBox.width = 125
    } else if (keys.a.pressed && player.lastKey === 'a') {
        player.speed.x = -5;
        player.attackBox.width = -125
    }

    enemy.speed.x = 0;

    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.speed.x = 5;
        enemy.attackBox.offset.x = 0
    } else if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.speed.x = -5;
        enemy.attackBox.offset.x = 125
    }

    // Detect colision
    if (RectangularColission({ rectangular1: player, rectangular2: enemy })
        && player.isAttacking) {
        player.isAttacking = false;
        console.log('PLAYER hits');
        enemy.health -= 10;
        document.querySelector('#enemyHP').style.width = enemy.health + "%"
    }
    if (RectangularColission({ rectangular1: enemy, rectangular2: player })
        && enemy.isAttacking) {
        enemy.isAttacking = false;
        console.log('ENEMY hits');
        player.health -= 10;
        document.querySelector('#playerHP').style.width = player.health + "%"
    }

    // End game
    if (player.health <= 0 || enemy.health <= 0) {
        GameOver();
    }

    if (player.speed.y === 0) {
        player.jumpCount = 0
    }
    if (enemy.speed.y === 0) {
        enemy.jumpCount = 0
    }
}
animate();

// PLAYERS

// ___________________________________________________

// MOVEMENT CONTROL

const siteWindow = window;

function KeyPressed(event) {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            if (player.jumpCount < 2) {
                player.speed.y = -17
                player.jumpCount++
            } else if (player.speed.y === 0) {
                player.speed.y = -17
            }
            break
        case 's':
            player.height = 75
            break
        case ' ':
            player.attack()
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            if (enemy.jumpCount < 2) {
                enemy.speed.y = -17
                enemy.jumpCount++
            } else if (enemy.speed.y === 0) {
                enemy.speed.y = -17
            }
            break
        case 'ArrowDown':
            enemy.height = 75;
            break
        case 'Enter':
            enemy.attack()
            break
    }
}
function KeyUp() {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            player.height = 150
            player.position.y -= 75
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowDown':
            enemy.height = 150
            enemy.position.y -= 75
            break
    }
}


siteWindow.addEventListener('keydown', KeyPressed);
siteWindow.addEventListener('keyup', KeyUp);

// MOVEMENT CONTROL

// ___________________________________________________

// TIMER AND END GAME

function GameOver() {
    clearTimeout(timerTimeout);
    siteWindow.removeEventListener('keydown', KeyPressed);
    siteWindow.removeEventListener('keyup', KeyUp);
    document.getElementById('result').style.display = 'flex';
    if (player.health === enemy.health) {
        document.getElementById('result').innerHTML = 'Draw';
    } else if (player.health > enemy.health) {
        document.getElementById('result').innerHTML = 'Player 1 wins';
    } else if (player.health < enemy.health) {
        document.getElementById('result').innerHTML = 'Player 2 wins';
    }
}

let timer = 60;
let timerTimeout;

function TimerDecrease() {
    timerTimeout = setTimeout(TimerDecrease, 1000)
    if (timer > 0) {
        timer--;
        document.getElementById('timer').innerHTML = timer;
    }
    if (timer == 0) {
        GameOver()
    }
}
setTimeout(() => {
    TimerDecrease()
}, 1000);

// TIMER AND END GAME

// ___________________________________________________