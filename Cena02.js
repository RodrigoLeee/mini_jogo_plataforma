class Cena02 extends Phaser.Scene {
    constructor(player, platforms, cursors, stars, bombs, scoreText) {
        super('Cena02');
        
        //definindo variáveis a serem utilizadas
        this.player = player;
        this.platforms = platforms;
        this.cursors = cursors;
        this.stars = stars;
        this.bombs = bombs;
        this.scoreText = scoreText;
    }

    init() {
    
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('bomb', 'assets/bomb.png');
    }

    create() {
        //Background
        this.add.image(400, 300, 'sky');

        //Plataformas
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();  
        this.platforms.create(600, 400, 'ground'); 
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        //Player
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2); 
        this.player.setCollideWorldBounds(true);

        //Animação para esquerda, Player
        this.anims.create({ 
            key: 'left', 
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), //Define os frames que serão usados do sprite 
            frameRate: 10, 
            repeat: -1 
        });
        //Animação Turn
        this.anims.create({
            key: 'turn', 
            frames: [ { key: 'dude', frame: 4 } ], 
            frameRate: 20 //Frames por segundo
        });
        //Animação para direita, Player
        this.anims.create({ 
            key: 'right', 
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }), 
            frameRate: 10, 
            repeat: -1 
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        
        //Stars
        this.stars = this.physics.add.group({ //Define a fisica dos stars
            key: 'star', //Define o nome do frame
            repeat: 11, //Define quantas vezes repetir
            setXY: { x: 12, y: 0, stepX: 70 } //Define a posicao da estrela e numero de pixels para estrelas
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });    

        //Bomba
        this.bombs = this.physics.add.group();

        //Placar
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //Colisões
        this.physics.add.collider(this.player, this.platforms); //Colisao entre player, estrelas e bombas COM AS PLATAFORMAS
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);

        this.physics.add.overlap(this.player, this.stars, collectStar, null, this);
        this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);
    }

    update(){
        if (this.cursors.left.isDown) //Movimento no eixo X para esquerda
        {
            this.player.setVelocityX(-160);
    
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) //Movimento no eixo X para direita
        {
            this.player.setVelocityX(160);
    
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0); //Nenhum movimento no eixo X
    
            this.player.anims.play('turn');
        }
    
        if (this.cursors.up.isDown && this.player.body.touching.down) //Movimento para cima, pular, eixo Y
        {
            this.player.setVelocityY(-330);
        }
    }
}

var score = 0;

function collectStar (player, star) //Funcao de pegar estrela
{
    star.disableBody(true, true); //disable depois de entrar em contato

    //  Add and update the score
    score += 10;
    this.scoreText.setText('Score: ' + score); //Muda score

    if (this.stars.countActive(true) === 0) //Se existe ZERO eestrelas na tela
    {
        //  A new batch of stars to collect
        this.stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true); //enable as stars, denovo

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400); //Procura posicao posicao do player

        var bomb = this.bombs.create(x, 16, 'bomb'); //cria bomba
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb, score) //Player entrar em contato com a bomba, se torna vermelho
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

}
