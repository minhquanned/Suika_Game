class Paimon
{
    static sprite;

    constructor(context, x, y, speed) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.speed = speed;

        this.loadImage();
        
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                // case 'Enter':
                //     break;
                case 'ArrowLeft':
                case 'a':
                    this.x -= this.speed;
                    this.limitedMove();
                    break;
                case 'ArrowRight':
                case 'd':
                    this.x += this.speed;
                    this.limitedMove();
                    break;
            }
        });

        window.addEventListener('mousemove', (e) => {
            const rect = this.context.canvas.getBoundingClientRect();

            // Get the mouse position
            this.x = e.clientX - rect.left;
            this.limitedMove();
        });
    }

    loadImage() {
        if (!Paimon.sprite) {
            Paimon.sprite = new Image();
            
            Paimon.sprite.onload = () => {
                console.log('Paimon loaded!');
            }
            Paimon.sprite.src = './assets/Chibi_Paimon.png';
        }
    }

    draw(canvas) {
        const scaleWidth = Paimon.sprite.width / 5;
        const scaleHeight = Paimon.sprite.height / 5;

        // Drop line
        this.context.setLineDash([15, 10]);
        this.context.beginPath();
        this.context.moveTo(this.x, this.y + 50);
        this.context.lineTo(this.x, canvas.height - 25);
        this.context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.context.lineWidth = 5;
        this.context.stroke();
        // Change the origin to the center of the image
        this.context.save();
        this.context.translate(this.x, this.y);
        // Paimon
        this.context.drawImage(Paimon.sprite, -scaleWidth / 2 - 30, -scaleHeight / 2, scaleWidth, scaleHeight);
        this.context.restore();
    }

    limitedMove() {
        if (this.x <= 395) {
            this.x = 395;
        }
        if (this.x >= 885) {
            this.x = 885;
        }
    }

    holdSuika(suika) {
        if (suika && suika.isHolding) {
            suika.x = this.x;
            suika.y = this.y + 50;
        }
    }
}

export { Paimon };