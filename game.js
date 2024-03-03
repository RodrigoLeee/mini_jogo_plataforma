window.onload = function() { //CONFIGURAÇÃO DAS CENAS
    const config = { 
        type: Phaser.AUTO,
        width: 800, //Largura da Tela
        height: 600, //Altura da ela
        physics: {
            default: 'arcade', //Tipo de fisica, arcade
            arcade: {
                gravity: { y: 200 }, //Gravidade do jogo
                debug: false 
            }
        },
        scene: [Cena01, Cena02] //Ordem de qual cena carrega em qual ordem
    };

    const game = new Phaser.Game(config);
}