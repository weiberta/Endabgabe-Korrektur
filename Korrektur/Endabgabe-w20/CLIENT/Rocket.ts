namespace FireworkCrafting {

    export class Rocket {
        private pos: Vector2D;
        private config: Config;


        private particles: Particle[] = [];
        constructor(pos: Vector2D, config: Config) {
            this.pos = pos;
            this.config = config;

            const angleIncrement: number = Math.PI * 2 / this.config.particleNumber;
            for (let i: number = 0; i < this.config.particleNumber; i++) {
                const color: string = `hsl(${this.config.hue},100%,50%` ;

                const velocity: Vector2D = {
                    x: Math.cos(angleIncrement * i) * Math.random() * this.config.particleSpeed,
                    //gleiches für die y koordinate
                    y: Math.sin(angleIncrement * i) * Math.random() * this.config.particleSpeed
                };

                //Eigene Position für den Partikel erstellen, damit nicht alle Partikel die gleiche Position haben
                const pos: Vector2D = new Vector2D(this.pos.x, this.pos.y);

                //Erstellen des neuen Partikels und hinzufügen zu dem Partikel Array
                this.particles.push(new Particle(pos, this.config.particleRadius, color, velocity));
            }
        }

        public update(): void {
            this.particles.forEach(particle => particle.update());
        }

        public finished(): boolean {
            return this.particles[0].alpha < 0;
        }
    }
}