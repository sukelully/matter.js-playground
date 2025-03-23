class BassMarble extends Marble {
    constructor(x, y, r) {
        super(x, y, r); // Call the parent class constructor

        // Override or add specific properties for BassMarble
        this.body.label = 'bass-marble';

        // Explicitly enforce the color after the parent constructor
        this.color = 'black';

        // Set a random velocity specific to BassMarble
        const randomVelocity = Marble.getRandomVelocity();
        Body.setVelocity(this.body, randomVelocity);

        // Set collision filtering to avoid collisions with other marbles
        this.body.collisionFilter = {
            category: bassMarbleCategory,
            mask: marbleCategory | worldCategory
        };
    }
}