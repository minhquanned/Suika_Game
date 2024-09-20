import { GameObject } from './game_object.js';

let g = 500;

class Suika extends GameObject
{
    constructor(context, x, y, vx, vy, mass, isHolding, radius, image, level) {
        super(context, x, y, vx, vy, mass);
        this.radius = radius;
        this.isHolding = isHolding;
        this.image = image;
        this.level = level;
        this.degrees = 0;
        this.rotation = 0;
        this.angularVelocity = 0;
        this.firstTimeCollision = false;
    }

    draw() {
        this.context.save();
        this.context.translate(this.x, this.y);
        // This line is for rotating the image
        this.context.rotate(this.rotation);
        this.context.translate(-this.x, -this.y);

        // Aspect ratio of the image
        let aspectRatio = this.image.width / this.image.height;
        let realWidth = this.radius * 2;
        let realHeight = realWidth / aspectRatio;

        this.context.drawImage(
            this.image, 
            0, 0, 
            this.image.width, this.image.height, 
            (this.x - realWidth / 2), (this.y - realHeight / 2), 
            realWidth, realHeight
        );
        this.context.restore();
        
        // Draw the hitbox
        // this.context.setLineDash([0,0]);
        // this.context.beginPath();
        // this.context.strokeStyle= 'red';
        // this.context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        // this.context.lineWidth = 1;
        // this.context.stroke();
    }

    update (secondsPassed) {
        // Apply gravity
        this.vy += g * secondsPassed;

        // Move with set velocity
        this.x += this.vx * secondsPassed;
        this.y += this.vy * secondsPassed;

        // Update angle base on angular velocity
        this.angularVelocity = this.vx / this.radius;
        this.rotation += this.angularVelocity * secondsPassed;

        // decrease rotate speed
        this.angularVelocity *= 0.98;
    }
}



export { Suika };