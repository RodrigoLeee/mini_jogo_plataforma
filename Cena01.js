class Cena01 extends Phaser.Scene {
    constructor(botao) {
        super('Cena01');

        this.botao = botao
    }

    preload(){
        this.load.image('intro', 'assets/intro.png')
        this.load.image('bt_play', 'assets/play_bt.png');
    }
    

    create() { 
        this.add.image(400, 300, 'intro')
        this.botao = this.add.image(400, 500, 'bt_play').setInteractive()
        this.botao.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () =>{
            this.scene.start('Cena02');
        })
    }

    update() {
        
    }
}