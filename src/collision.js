import { suikaSamples } from "./app.js";
import { SoundManager } from "./sound_manager.js";
import { Suika } from "./suika.js";

const canvasWidth = 1280;
const canvasHeight = 720;

let isMerging = false;

let restitution = 0.2;
let frictionForce = 0.98;
let angularForce = 0.2;

let soundManager = new SoundManager();

function mergeSuika(suikas) {
    let mergedSuika;

    for (let i = 0; i < suikas.length; i++) {
        for (let j = i + 1; j < suikas.length; j++) {
            let suika1 = suikas[i];
            let suika2 = suikas[j];

            // Check if suika1 collides with suika2 and have the same type
            if (circleIntersect(suika1.x, suika1.y, suika1.radius, suika2.x, suika2.y, suika2.radius)
                && suika1.level === suika2.level)
            {
                isMerging = true;
                // Find the next suika
                let newSuikaIndex = suikaSamples.findIndex((suika) => suika.level === suika1.level + 1);
                console.log('newSuikaIndex:', newSuikaIndex);

                if (newSuikaIndex === -1) {
                    isGameEnd = true;
                    console.log('error!');
                    break;
                } else if (newSuikaIndex < suikaSamples.length) {
                    let newSuikaStats = suikaSamples[newSuikaIndex];
                    soundManager.playEffectSound('merge');

                    mergedSuika = new Suika(
                        suika1.context,
                        (suika1.x + suika2.x) / 2,
                        (suika1.y + suika2.y) / 2,
                        0, 0,
                        newSuikaStats.mass,
                        false,
                        newSuikaStats.radius,
                        newSuikaStats.img,
                        newSuikaStats.level
                    )
                    suikas.push(mergedSuika);
                }
                
                suikas.splice(j, 1);
                suikas.splice(i, 1);
                i--;

                if (mergedSuika.level === 11) {
                    isGameEnd = true;
                    console.log('Suika!');
                }

                isMerging = false;
                break;
            }
        }
    }
}

function detectCollision(gameObjects)
{
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++)
    {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj1 = gameObjects[i];

        for (let j = i + 1; j < gameObjects.length; j++)
        {
            obj2 = gameObjects[j];

            // Compare obj1 with obj2
            if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius))
            {
                // Apply collision response
                obj1.isColliding = true;
                obj2.isColliding = true;
                obj1.firstTimeCollision = true;
                obj2.firstTimeCollision = true;

                let overlap = (obj1.radius + obj2.radius) - Math.sqrt((obj1.x - obj2.x) * (obj1.x - obj2.x) + (obj1.y - obj2.y) * (obj1.y - obj2.y));
                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let distance = Math.sqrt(vCollision.x * vCollision.x + vCollision.y * vCollision.y);
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};

                // Avoid overlapping
                obj1.x -= vCollisionNorm.x * overlap / 2;
                obj1.y -= vCollisionNorm.y * overlap / 2;
                obj2.x += vCollisionNorm.x * overlap / 2;
                obj2.y += vCollisionNorm.y * overlap / 2;

                // Calculate speed after collision
                let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
                let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

                speed *= restitution;

                if (speed < 0)
                {
                    break;
                }

                let impulse = 2 * speed / (obj1.mass + obj2.mass);
                obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
                obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
                obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
                obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);

                // Add rotate effect
                obj1.angularVelocity += angularForce * (obj1.vx / obj1.radius);
                obj2.angularVelocity -= angularForce * (obj2.vx / obj2.radius);
            }
        }
    }
    
}

function boxCollision(gameObjects) {
    let obj;

    for (let i = 0; i < gameObjects.length; i++) {
        obj = gameObjects[i];

        // obj.vy += gravity;

        // Check left and right
        if (obj.x - obj.radius < 375)
        {
            obj.vx = Math.abs(obj.vx) * restitution;
            obj.x = 375 + obj.radius;
        } else if (obj.x + obj.radius > canvasWidth - 375)
        {
            obj.vx = -Math.abs(obj.vx) * restitution;
            obj.x = canvasWidth - 375 - obj.radius;
        }

        // Check top and bottom        
        if (obj.y - obj.radius < 156 && obj.firstTimeCollision === true)
        {
            isGameEnd = true;
            // console.log('top reached!');
        } else if (obj.y + obj.radius > canvasHeight - 37)
        {
            obj.vy = -Math.abs(obj.vy) * restitution;
            obj.y = canvasHeight - 37 - obj.radius;

            // Apply friction
            obj.vx *= frictionForce;
            if (Math.abs(obj.vx) < 0.1)
            {
                obj.vx = 0;
            }
        }
    }
}

function circleIntersect(x1, y1, r1, x2, y2, r2)
{
    let dx = x1 - x2;
    let dy = y1 - y2;
    let distance = Math.sqrt(dx * dx + dy * dy);

    return distance < r1 + r2 + 1;
}

function collisionManager(suikas) {
    detectCollision(suikas);
    mergeSuika(suikas);
    boxCollision(suikas);
}

export { boxCollision, circleIntersect, detectCollision, mergeSuika, collisionManager, canvasWidth, canvasHeight };