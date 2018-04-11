// ClientPlayer model
// (String) username , ({}) stats
class ClientPlayer extends Player {
    constructor (username, stats) {
        super(username, stats);

        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
    }

    // handles player movement
    move () {
        // handle movement
        let updated = false;

        if (this.up) {
            this.location.y -= this.speed;
            updated = true;
        }

        if (this.down) {
            this.location.y += this.speed;
            updated = true;
        }

        if (this.left) {
            this.location.x -= this.speed;
            updated = true;
        }

        if (this.right) {
            this.location.x += this.speed;
            updated = true;
        }

        // tell the server if movement updated
        if (updated) {
            // if player has ventured too far from classical tilemap bounds {(0,0) <=> (tilemap.width, tilemap.height)},
            // reset player location to within the classical tilemap bounds
            const tooFarY = (OasisWorld.tiles.length * Tile.size.height) / 2;
            const tooFarX = (OasisWorld.tiles.length * Tile.size.width) / 2;

            // too far up/left
            if (this.location.y < -(tooFarY)) this.location.y += (tooFarY * 2);
            if (this.location.x < -(tooFarX)) this.location.x += (tooFarX * 2);

            // too far down/right
            if (this.location.y > tooFarY) this.location.y -= (tooFarY * 2);
            if (this.location.x > tooFarX) this.location.x -= (tooFarX * 2);

            // tell the others
            socket.emit('location update', this.location);
        }
    }
}

// initializes this clients player
function initPlayer () {
    // load client player stats
    const username = localStorage.getItem('Oasis-session-username');

    const stats = {};
    stats.location = new Location(0, 0);
    stats.size = new Size(50, 50);
    stats.speed = (username === 'Doctor Bees' || username === 'Todd')? 12 : 8;
    stats.color = (username === 'Doctor Bees' || username === 'Todd')? 'gold' : 'red';

    // create this clients player
    OasisPlayer = new ClientPlayer(username, stats);
}