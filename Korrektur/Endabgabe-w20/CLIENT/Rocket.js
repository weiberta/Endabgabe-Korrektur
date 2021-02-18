"use strict";
var FireworkCrafting;
(function (FireworkCrafting) {
    class Rocket {
        constructor(pos, config) {
            this.particles = [];
            this.pos = pos;
            this.config = config;
            const angleIncrement = Math.PI * 2 / this.config.particleNumber;
            for (let i = 0; i < this.config.particleNumber; i++) {
                const color = `hsl(${this.config.hue},100%,50%`;
                const velocity = {
                    x: Math.cos(angleIncrement * i) * Math.random() * this.config.particleSpeed,
                    //gleiches für die y koordinate
                    y: Math.sin(angleIncrement * i) * Math.random() * this.config.particleSpeed
                };
                //Eigene Position für den Partikel erstellen, damit nicht alle Partikel die gleiche Position haben
                const pos = new FireworkCrafting.Vector2D(this.pos.x, this.pos.y);
                //Erstellen des neuen Partikels und hinzufügen zu dem Partikel Array
                this.particles.push(new FireworkCrafting.Particle(pos, this.config.particleRadius, color, velocity));
            }
        }
        update() {
            this.particles.forEach(particle => particle.update());
        }
        finished() {
            return this.particles[0].alpha < 0;
        }
    }
    FireworkCrafting.Rocket = Rocket;
})(FireworkCrafting || (FireworkCrafting = {}));
//# sourceMappingURL=Rocket.js.map