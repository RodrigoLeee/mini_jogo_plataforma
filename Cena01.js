class Cena01 extends Phaser.Scene {
    constructor(botao) {
        super('Cena01');
        //Variável do botão
        this.botao = botao
    }

    preload(){
        //Carrega intro com as instruções
        this.load.image('intro', 'assets/intro.png')
        //Carrega botão de play
        this.load.image('bt_play', 'assets/play_bt.png');
    }
    

    create() { 
        //Adiciona imagem de intro
        this.add.image(400, 300, 'intro')

        //Botão de play
        this.botao = this.add.image(400, 500, 'bt_play').setInteractive()
        this.botao.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () =>{
            this.scene.start('Cena02');
        })
    }

    update() {
        
    }
}