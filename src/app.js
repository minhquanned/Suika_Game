import { collisionManager } from './collision.js';
import { draw, drawWinOrLoseScreen } from './draw.js';
import { Paimon } from './paimon.js';
import { Suika } from './suika.js';

'use strict';
let canvas;
let context;
let background = new Image();
background.onload = () => {
    console.log('Background loaded!');
}
background.src = '../assets/background.png';

let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 50;
let timesPassed = 0;

window.isGameEnd = false;

// Spawn stuffs
let isSpawning = false;
const spawnCooldown = 0.8;
let spawnTimer = 0;
let currentSuika;

// Avoid spam
let pressCooldown = spawnCooldown + 0.05;
let pressTimer = pressCooldown;


let paimon;

let suikaPaths = [
    {path: '../assets/1 - cherry.png', mass: 5, radius: 15, level: 1},
    {path: '../assets/2 - strawberry.png', mass: 10, radius: 23, level: 2},
    {path: '../assets/3 - grape.png', mass: 6, radius: 36, level: 3},
    {path: '../assets/4 - dekopon.png', mass: 7, radius: 49, level: 4},
    {path: '../assets/5 - orange.png', mass: 8, radius: 62, level: 5},
    {path: '../assets/6 - apple.png', mass: 9, radius: 75, level: 6},
    {path: '../assets/7 - pear.png', mass: 10, radius: 88, level: 7},
    {path: '../assets/8 - peach.png', mass: 11, radius: 101, level: 8},
    {path: '../assets/9 - pineapple.png', mass: 12, radius: 114, level: 9},
    {path: '../assets/10 - melon.png', mass: 13, radius: 127, level: 10},
    {path: '../assets/11 - watermelon.png', mass: 14, radius: 140, level: 11},
];
let suikaSamples = [];
let suikaBag = [];
let suikas = [];

window.onload = init;

function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    // Load images and store in suikaSamples
    suikaPaths.forEach((path) => {
        let img = new Image();
        img.onload = () => {
            console.log('Suika loaded!');
        };
        img.src = path.path;
        suikaSamples.push({img: img, mass: path.mass, radius: path.radius, level: path.level});
    });

    paimon = new Paimon(context, canvas.width / 2, 75, 10);

    if (suikaSamples.length > 0) {
        currentSuika = new Suika(
            context, 
            paimon.x, 125, 
            0, 0, 
            suikaSamples[0].mass, 
            true, 
            suikaSamples[0].radius, 
            suikaSamples[0].img, 
            suikaSamples[0].level
        );
    }

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (isGameEnd) {
        drawWinOrLoseScreen(context, canvas, suikas);
        return;
    }

    // Calculate how much time has passed
    let secondsPassed = (timestamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.1); // To prevent jumps in time caused by lag
    oldTimeStamp = timestamp;
    pressTimer += secondsPassed;

    // Clear phase
    clearCanvas();

    // Update phase
    fillSuikaBag();
    dropAndSpawn(paimon, suikas, secondsPassed);
    paimon.holdSuika(currentSuika);

    // Check collision
    collisionManager(suikas);
    console.log('isGameEnd:', isGameEnd);

    // Draw phase
    draw(paimon, suikas, suikaBag, currentSuika, context, canvas);

    // Request the next frame
    window.requestAnimationFrame(gameLoop);
}

function suikaSpawn(paimon, suikas, secondsPassed) {
    if (isSpawning) {
        return;
    }

    spawnTimer += secondsPassed;
    if (spawnTimer >= spawnCooldown && (suikas.length === 0 || !suikas[suikas.length - 1].isHolding)) {
        isSpawning = true;

        console.log('suikaBag:  ', suikaBag);
        let takedSuika = suikaBag[0];
        suikaBag.splice(0, 1);
        console.log('Taked Suika:', takedSuika);

        currentSuika = new Suika(
            context, 
            paimon.x, 125, 
            0, 0, 
            suikaBag[0].mass,
            true, 
            suikaBag[0].radius, 
            suikaBag[0].img, 
            suikaBag[0].level
        );

        spawnTimer = 0;
        isSpawning = false;
        console.log(suikas);
    }
    
}

function dropAndSpawn(paimon, suikas, secondsPassed) {
    // Spawn if there is no suika or the current suika is not holding
    if (suikas.length === 0 && !currentSuika.isHolding || !currentSuika.isHolding) {
        suikaSpawn(paimon, suikas, secondsPassed);
    } else {
        paimon.holdSuika(currentSuika);
    }

    // Drop
    for (let i = 0; i < suikas.length; i++) {
        if (!suikas[i].isHolding) {
            suikas[i].update(secondsPassed);
        }
    }
}

function fillSuikaBag() {
    while (suikaBag.length < 3) {
        suikaBag.push(suikaSamples[Math.floor(Math.random() * (suikaSamples.length - 7))]);
        // suikaBag.push(suikaSamples[9]);
    }
}

function clearCanvas() {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
}

window.addEventListener('click', (e) => {
    if (isGameEnd) {
        let rect = canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        if (x >= canvas.width / 2 - 100 && x <= canvas.width / 2 + 100
            && y >= canvas.height / 2 + 50 && y <= canvas.height / 2 + 100)
        {
            isGameEnd = false;
            suikas = [];
            spawnTimer = 0;
            oldTimeStamp = 0;
            currentSuika = new Suika(
                context, 
                paimon.x, 125, 
                0, 0, 
                suikaSamples[0].mass, 
                true, 
                suikaSamples[0].radius, 
                suikaSamples[0].img, 
                suikaSamples[0].level
            );

            window.requestAnimationFrame(gameLoop);
        }
    } else {
        if (pressTimer >= pressCooldown) {
            currentSuika.isHolding = false;
            suikas.push(currentSuika);
            pressTimer = 0;
        }
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        if (pressTimer >= pressCooldown) {
            currentSuika.isHolding = false;
            suikas.push(currentSuika);
            pressTimer = 0;
        }
    }
    if (e.key === 'p') {
        console.log(suikas);
        suikas.splice(0, 1);
        console.log(suikas);
    }
});

export { suikaSamples };