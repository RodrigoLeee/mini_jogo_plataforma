window.onload = function() { //CONFIGURAÇÃO DAS CENAS
    const config = { 
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 },
                debug: false 
            }
        },
        scene: [Cena01, Cena02] //Ordem de qual cena carrega em qual ordem
    };

    const game = new Phaser.Game(config);
}