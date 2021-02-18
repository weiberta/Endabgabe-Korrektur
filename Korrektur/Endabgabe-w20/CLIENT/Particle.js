"use strict";
var FireworkCrafting;
(function (FireworkCrafting) {
    //Klasse zum Darstellen eines Partikels
    class Particle {
        constructor(pos, radius, color, velocity) {
            this.alpha = 1;
            this.friction = 0.99;
            this.reduction = 0.005;
            this.gravity = 0.03;
            this.pos = pos;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;
        }
        draw() {
            FireworkCrafting.crc2.save();
            FireworkCrafting.crc2.globalAlpha = this.alpha;
            FireworkCrafting.crc2.beginPath();
            FireworkCrafting.crc2.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
            FireworkCrafting.crc2.fillStyle = this.color;
            FireworkCrafting.crc2.fill();
            FireworkCrafting.crc2.closePath();
            FireworkCrafting.crc2.restore();
        }
        //Update funktion Zeichnet ein Partikel und updated die Parameter
        update() {
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
    FireworkCrafting.Particle = Particle;
})(FireworkCrafting || (FireworkCrafting = {}));
//# sourceMappingURL=Particle.js.map