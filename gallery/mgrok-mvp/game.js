class VillageRun extends Phaser.Scene {
  constructor() {
    super("VillageRun");
    this.soundEnabled = false;
    this.audioCtx = null;
  }

  init() {
    this.soundEnabled = false;
    this.audioCtx = null;
  }

  createSound() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    this.soundEnabled = true;
  }

  playTone(freq, type, duration, vol = 0.1) {
    if (!this.soundEnabled || !this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playDash() {
    this.playTone(600, "sine", 0.15, 0.12);
    this.time.delayedCall(80, () => this.playTone(900, "sine", 0.12, 0.1));
  }

  playBite() {
    this.playTone(180, "sawtooth", 0.2, 0.12);
    this.time.delayedCall(100, () => this.playTone(140, "sawtooth", 0.18, 0.1));
  }

  playFeed() {
    this.playTone(800, "sine", 0.1, 0.1);
    this.time.delayedCall(70, () => this.playTone(1200, "sine", 0.12, 0.09));
  }

  preload() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    graphics.fillStyle(0x1a1a2e, 1);
    graphics.fillRect(0, 0, 800, 600);
    graphics.generateTexture("bg", 800, 600);
    graphics.clear();

    graphics.fillStyle(0x333333, 1);
    graphics.fillRect(0, 540, 800, 60);
    graphics.generateTexture("road", 800, 60);
    graphics.clear();

    graphics.fillStyle(0x00d9ff, 1);
    graphics.fillRoundedRect(0, 0, 40, 24, 4);
    graphics.generateTexture("player", 40, 24);
    graphics.clear();

    graphics.fillStyle(0xff6666, 1);
    graphics.fillRoundedRect(0, 0, 28, 28, 6);
    graphics.generateTexture("rabbit", 28, 28);
    graphics.clear();

    graphics.fillStyle(0xffaa00, 1);
    graphics.fillTriangle(0, 0, 12, 0, 6, 18);
    graphics.generateTexture("carrot", 12, 18);
    graphics.clear();

    this.input.once("pointerdown", () => this.createSound());
  }

  create() {
    this.add.image(400, 300, "bg");
    this.road = this.physics.add.staticImage(400, 560, "road");

    this.player = this.physics.add.sprite(120, 500, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setDrag(600);
    this.player.setMaxVelocity(260);

    this.rabbitGroup = this.physics.add.group();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.physics.add.collider(this.player, this.road);
    this.physics.add.overlap(this.player, this.rabbitGroup, this.bitePlayer, null, this);
    this.physics.add.overlap(this.player, this.rabbitGroup, this.tryFeedRabbit, null, this);

    this.health = 3;
    this.healthText = this.add.text(16, 16, "Health: 3", {
      fontSize: "24px",
      color: "#ffffff",
      fontStyle: "bold"
    });

    this.carrots = 5;
    this.carrotText = this.add.text(16, 48, "Carrots: 5", {
      fontSize: "24px",
      color: "#ffcc00",
      fontStyle: "bold"
    });

    this.invincible = false;
    this.isDiving = false;
    this.lastDashTime = 0;
    this.lastFeedCooldown = 0;

    this.time.addEvent({
      delay: 1400,
      loop: true,
      callback: this.spawnRabbit,
      callbackScope: this
    });

    const startText = this.add.text(400, 300, "Click to start sound", {
      fontSize: "20px",
      color: "#cccccc",
      backgroundColor: "#00000088",
      padding: { x: 10, y: 6 }
    });
    startText.setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      if (startText.active) startText.destroy();
    });
  }

  spawnRabbit() {
    const y = Phaser.Math.Between(470, 540);
    const rabbit = this.rabbitGroup.create(860, y, "rabbit");
    rabbit.setVelocityX(-Phaser.Math.Between(80, 160));
    rabbit.setScale(1.2);
    rabbit.setData("aggressive", true);
  }

  bitePlayer(player, rabbit) {
    if (!rabbit.getData("aggressive")) return;
    if (this.invincible || this.isDiving) return;
    if (rabbit.getData("biting")) return;

    rabbit.setData("biting", true);
    this.health -= 1;
    this.healthText.setText("Health: " + this.health);
    this.playBite();

    this.player.setTint(0xff0000);
    this.time.delayedCall(150, () => this.player.clearTint());

    rabbit.destroy();

    if (this.health <= 0) {
      this.scene.restart();
    }
  }

  tryFeedRabbit(player, rabbit) {
    if (!rabbit.getData("aggressive")) return;
    if (this.carrots <= 0) return;
    if (this.time.now - this.lastFeedCooldown < 800) return;

    const dist = Phaser.Math.Distance.Between(player.x, player.y, rabbit.x, rabbit.y);
    if (dist > 70) return;

    this.carrots -= 1;
    this.carrotText.setText("Carrots: " + this.carrots);
    this.lastFeedCooldown = this.time.now;
    this.playFeed();

    rabbit.setData("aggressive", false);
    rabbit.setTint(0x88ff88);
    rabbit.setVelocityX(0);

    const feedText = this.add.text(rabbit.x, rabbit.y - 20, "Yum!", {
      fontSize: "18px",
      color: "#ffcc00"
    });
    this.tweens.add({
      targets: feedText,
      y: feedText.y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => feedText.destroy()
    });

    this.time.delayedCall(3000, () => {
      if (rabbit.active) rabbit.destroy();
    });
  }

  update() {
    const speed = 220;
    const now = this.time.now;

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && now - this.lastDashTime > 1200) {
      this.lastDashTime = now;
      this.invincible = true;
      this.player.setTint(0x88ffff);
      this.playDash();

      const dashDir = this.cursors.left.isDown ? -1 : 1;
      this.player.setVelocityX(dashDir * 500);

      this.time.delayedCall(300, () => {
        this.invincible = false;
        this.player.clearTint();
      });
    }

    if (this.cursors.down.isDown && !this.isDiving && this.player.y > 460) {
      this.isDiving = true;
      this.player.setScale(1, 0.5);
      this.player.y += 10;

      this.time.delayedCall(600, () => {
        this.isDiving = false;
        this.player.setScale(1, 1);
        this.player.y -= 10;
      });
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && !this.isDiving) {
      this.player.setVelocityY(-speed * 0.6);
    } else if (this.cursors.down.isDown && !this.isDiving) {
      this.player.setVelocityY(speed * 0.6);
    } else if (!this.isDiving) {
      this.player.setVelocityY(0);
    }

    this.rabbitGroup.children.iterate((rabbit) => {
      if (rabbit && rabbit.x < -50) rabbit.destroy();
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [VillageRun]
};

new Phaser.Game(config);
