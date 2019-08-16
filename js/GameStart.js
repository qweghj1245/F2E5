const gameStart = {
    key: 'gameStart',
    preload: function(){
        // 載入資源
        this.load.image('startbg', 'assets/w5_90secgame_遊戲封面.png');
        this.load.image('play', 'assets/button_play.png');
        this.load.image('hinit', 'assets/button_hint.png');
        this.load.image('notice', 'assets/提示.png');
        this.load.image('close', 'assets/button_close.png');
    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
        this.startbg = this.add.image(w / 2, h / 2, 'startbg');
        this.play = this.add.image(w / 2 + 170, h / 2 + 250, 'play');
        this.hinit = this.add.image(w / 2 + 250, h / 2 + 250, 'hinit');

        this.play.setInteractive();
        this.play.on('pointerdown', () => {
          this.scene.start('gamePlay');
        });
        this.hinit.setInteractive();
        this.hinit.on('pointerdown', () => {
            this.notice = this.add.image(w / 2,  h / 2, 'notice');
            this.close = this.add.image(w / 2 + 390,  h / 2 - 290, 'close');
            this.close.setInteractive();
            this.close.on('pointerdown', () => {
                this.notice.destroy(true);
                this.close.destroy(true);
            });
        });
    },
    update: function(){
        // 遊戲狀態更新
    }
}