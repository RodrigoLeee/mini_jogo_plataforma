window.onload = function() { //CONFIGURAÇÃO DAS CENAS
    const config = { 
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: 800,
        height: 600,
        backgroundColor: "b9eaff",
        scene: [Cena01, Cena02] //Ordem de qual cena carrega em qual ordem
    };

    const game = new Phaser.Game(config);
}
