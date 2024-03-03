class Cena02 extends Phaser.Scene {
    constructor(player, platforms, platform_meio, cursors, baterias, rochas, scoreText, broken_ship, pueira_gravidade) {
        super('Cena02');
        //Definindo variáveis a serem utilizadas utilizando uma LISTA
        //LISTA com variáveis a serem utilizadas
        var lista_variaveis = [player, platforms, platform_meio, cursors, baterias, rochas, scoreText, broken_ship, pueira_gravidade]
        //Definindo variáveis a serem utilizadas utilizando o LOOP FOR
        //LOOP FOR que define as variáveis do objeto a serem utilizadas
        for (var x in lista_variaveis) {
            var guarda_valor = lista_variaveis[x];
            this.guarda_valor = lista_variaveis[x];
        }
    }

    init() {    
    }

    preload() {
        //Carrega IMAGENS e SPRITESHEET
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('bateria', 'assets/bateria.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('rochas', 'assets/rochas.png');
        this.load.image('platform_meio', 'assets/platform_meio.png')
        this.load.image('broken_ship', 'assets/broken_ship.png')
        this.load.image('pueira_gravidade', 'assets/pueira_gravidade.png')
    }

    create() {
        //Adiciona Background
        this.add.image(400, 300, 'sky');

        //Plataformas Gerais
        this.platforms = this.physics.add.staticGroup(); //Define a física das plataformas
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody(); //Cria 1a plataforma - Chão do mapa inteiro
        this.platforms.create(750, 220, 'ground'); //Cria 2a plataforoma - Em cima do mapa
        
        //Plataforma que se mexe
        this.platform_meio = this.physics.add.sprite(200, 400, 'platform_meio'); //Plataforma do meio
        this.platform_meio.body.allowGravity = false; //Desliga a gravidade da plataforma
        this.platform_meio.body.setCollideWorldBounds(true); //Colisão com bordas do jogo
        this.platform_meio.body.immovable = true; //Objeto não pode ser mexido por colisões
        this.platform_meio.body.setBounce(1); //Objeto bate e volta com a mesma velocidade
        this.platform_meio.body.setVelocityX(100); //Velocidade da plataforma eixo X
        
        //Player
        //Adiciona física ao player, bounce e colisão com borda do mapa
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.3); //Bounce do player
        this.player.setCollideWorldBounds(true); //Colisão borda do mapa

        //Cria a pueira/gravidade
        this.pueira_gravidade = this.add.sprite(0, 0, 'pueira_gravidade'); //Adiciona sprite da pueira_gravidade
        this.pueira_gravidade.setVisible(false) //Define a pueira_gravidade como invisível

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

        //Recebe input cursores do teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        
        //Baterias
        this.baterias = this.physics.add.group({ //Define a fisica das baterias
            key: 'bateria', //Define o nome do frame
            repeat: 4, //Define quantas vezes repetir 11
            setXY: { x: 20, y: 0, stepX: 190 } //Define a posicao da estrela e numero de pixels para estrelas
        });

        this.baterias.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0, 0.5)); //Quanto bate e volta 
            child.setCollideWorldBounds = true; //Baterias possuem colisões com borda do mundo, para não sairem da tela
        });    

        //Rocha, define a física
        this.rochas = this.physics.add.group();

        //Placar
        this.scoreText = this.add.text(16, 16, 'Placar: 0', { fontSize: '32px', fill: '#000' });

        //Colisões entre diferentes ELEMENTOS do jogo
        //Colisões principalmente dos outros ELEMENTOS com as PLATAFORMAS
        this.physics.add.collider(this.player, this.platforms); 
        this.physics.add.collider(this.baterias, this.platforms); 
        this.physics.add.collider(this.rochas, this.platforms); 

        //Colisões principalmente dos outros ELEMENTOS com a PLATAFORMA QUE SE MEXE 
        this.physics.add.collider(this.player, this.platform_meio); 
        this.physics.add.collider(this.baterias, this.platform_meio);
        this.physics.add.collider(this.rochas, this.platform_meio);

        //Colisão, overlap e interação do PLAYER com outros ELEMENTOS (Bateria e rochas)
        this.physics.add.overlap(this.player, this.baterias, collectStar, null, this);
        this.physics.add.collider(this.player, this.rochas, hitRocha, null, this);

        //Sprite decorativo da nave quebrada
        this.broken_ship = this.add.sprite(120, 565, 'broken_ship');
    }

    update(){
        if (this.cursors.left.isDown) //Movimento no eixo X para esquerda, PLAYER
        {
            //Movimento
            this.player.setVelocityX(-250);
            //Animação
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) //Movimento no eixo X para direita, PLAYER
        {
            //Movimento
            this.player.setVelocityX(250);
            //Animação
            this.player.anims.play('right', true);
        }
        else
        {
            //Movimento
            this.player.setVelocityX(0); //Nenhum movimento no eixo X, PLAYER
            //Animação
            this.player.anims.play('turn');
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) //Movimento para cima, pular, eixo Y, PLAYER
        {
            //Velocidade do player no eixo Y
            this.player.setVelocityY(-300);
            //Quando o player pula, pueira_gravidade apareçe
            this.pueira_gravidade.setVisible(true);
        }
        else {
            //pueira_gravidade se torna invisível
            this.pueira_gravidade.setVisible(false);
        }
        //Definea posição da pueira, constantemente no update mas fica ou visível ou invisível
        this.pueira_gravidade.setPosition(this.player.x, this.player.y + this.player.height/2);
    }
}

//Reseta score
var score = 0;
function collectStar (player, bateria) //Funcao de pegar estrela
{
    bateria.disableBody(true, true); //disable depois de entrar em contato
    //  Add and update the score
    score += 100;
    this.scoreText.setText('Score: ' + score); //Muda score

    if (this.baterias.countActive(true) === 0) //Se existe zero baterias na tela
    {
        //  A new batch of stars to collect
        this.baterias.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true); //enable as baterias, denovo
        });

        var x = (player.x < 400) ? Phaser.Math.Between(600, 800) : Phaser.Math.Between(0, 200); //Procura posicao posicao do player

        var rocha = this.rochas.create(x, 16, 'rochas'); //cria rochas
        rocha.setBounce(1); //Rochas batem no chão e voltam
        rocha.setCollideWorldBounds(true); //Rochas contato com chão
        rocha.setVelocity(Phaser.Math.Between(-450, 450), 20); //Velocidade das rochas
        rocha.allowGravity = false; //Rochas não possuem gravidade, INÉRCIA

    }
}

function hitRocha (player, rocha, score) //Player entrar em contato com a rochas, se torna vermelho
{
    this.physics.pause(); //Pausa fisica do jogo

    player.setTint(0xff0000); //Vermelho

    player.anims.play('turn'); //Animação olhando para frente

    window.location.reload(); //Recomeça jogo
}
