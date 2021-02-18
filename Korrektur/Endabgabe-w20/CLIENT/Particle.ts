namespace FireworkCrafting {

    //Klasse zum Darstellen eines Partikels
    export class Particle {
        public  alpha: number = 1;
        private friction: number = 0.99;
        private reduction: number = 0.005;
        private gravity: number = 0.03;
        private pos: Vector2D;
        private radius: number;
        private color: string;
        private velocity: Vector2D

        constructor(pos: Vector2D, radius: number, color: string, velocity: Vector2D) {
            this.pos = pos;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;
        }

        public draw(): void {
            crc2.save();
            crc2.globalAlpha = this.alpha;

            crc2.beginPath();
            crc2.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
            crc2.fillStyle = this.color;
            crc2.fill();
            crc2.closePath();
            crc2.restore();
        }

        //Update funktion Zeichnet ein Partikel und updated die Parameter
        public update(): void {
            this.draw();

            //x und y velocity mit friction(Reibung) multiplizieren (verlangsamt x und y geschwindigkeit über Zeit)
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;

            //Gravity auf velocity y dazuaddieren, Damit der Partikel immer schneller zu boden sinkt
            this.velocity.y += this.gravity;

            //velocity auf position dazuaddieren
            this.pos.x += this.velocity.x;
            this.pos.y += this.velocity.y;

            //Alpha des Partikels verringern, damit der Partikel an Helligkeit über Zeit verliert
            this.alpha -= this.reduction;
        }
    }
}
