const getRandom = (max, min) =>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const gamePlay = {
    key: 'gamePlay',
    preload: function(){
        // 載入資源
        this.load.image('playbg', 'assets/w5_90secgame_地圖1背景圖.png');
        this.load.image('playbg2', 'assets/w5_90secgame_地圖2背景圖.png');
        this.load.image('playbg3', 'assets/w5_90secgame_地圖3背景圖.png');
        this.load.image('time', 'assets/timebubble.png');
        this.load.image('qa', 'assets/button_hint2.png');
        this.load.image('footer', 'assets/map1_rock.png');
        this.load.image('footer2', 'assets/map2_rock.png');
        this.load.image('footer3', 'assets/map3_rock.png');
        this.load.image('trash1', 'assets/寶特瓶.png');
        this.load.image('trash2', 'assets/鋁罐.png');
        this.load.image('trash3', 'assets/塑膠袋.png');
        this.load.image('trash4', 'assets/漁網.png');
        this.load.image('watermother', 'assets/水母.png');
        this.load.image('turtleLife', 'assets/turtlelife.png');
        this.load.image('gameover1', 'assets/gameover_1.png');
        this.load.image('gameover2', 'assets/gameover_2.png');
        this.load.image('playagain', 'assets/icon_playagain.png');
        this.load.spritesheet('user', 'assets/turtlemove.png', {frameWidth: 400, frameHeight: 400});

        this.iskeyJump = true;
        this.gameStop = false;
        this.status = '';
        this.monsterArr = [];
        this.monsterArrt = [];
        this.monsterArrs = []
        this.healthArr = [];
        this.masIdx = 0; 
        this.masIdx2 = 1; 
        this.masIdx3 = 0;
        this.masIdx4 = 0; 
        this.TimeStep = 90; // 遊戲時間
        this.life = 3; // 生命
    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
        this.playbg = this.add.tileSprite(w / 2, h / 2, w, h, 'playbg');
        this.playbg2 = this.add.tileSprite(w / 2 + 1366, h / 2, w, h, 'playbg2');
        this.playbg3 = this.add.tileSprite(w / 2 + 1366, h / 2, w, h, 'playbg3');
        this.footer = this.add.tileSprite(w / 2, h + 170, w, h, 'footer');
        this.footer2 = this.add.tileSprite(w / 2 + 1366, h + 155, w, h, 'footer2');
        this.footer3 = this.add.tileSprite(w / 2 + 1366, h + 220, w, h, 'footer3');
        this.turtleLife = this.add.tileSprite(w / 2 - 610, h / 2 - 320, 75, 60, 'turtleLife');        
        this.time = this.add.image(w / 2 + 580, h / 2 - 320, 'time');
        this.qa = this.add.image(w / 2 + 490, h / 2 - 320, 'qa');

        let gametime = setInterval(()=>{
            this.TimeStep--;
            this.timeText.setText(this.TimeStep.toString().padStart(2, '0'));
            if(this.TimeStep <= 0){
                this.gameStop = true;
                this.gameover2 = this.add.image(w / 2, h / 2, 'gameover2');
                this.playagain = this.add.image(w / 2, h / 2 + 110, 'playagain');
                this.playagain.setInteractive();
                this.playagain.on('pointerdown', () => this.scene.start('gameStart'));
                clearInterval(gametime);
            }
        }, 1000);
        
        // 文字
        this.timeText = this.add.text(w / 2 + 556, h / 2 - 338, this.TimeStep, { fontSize: '40px', fill: '#FFFFFF' });
        this.lifeText = this.add.text(w / 2 - 546, h / 2 - 338, `X ${this.life}`, { fontSize: '40px', fill: '#707070' })

        this.player = this.physics.add.sprite(w / 7, h / 2, 'user');
        this.player.setScale(.9);
        this.player.setCollideWorldBounds(true); //角色邊界限制
        this.player.setBounce(0); //設定彈跳值
        this.player.setSize(290, 160, true);
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('user', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'runing',
            frames: this.anims.generateFrameNumbers('user', { start: 2, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'deel',
            frames: this.anims.generateFrameNumbers('user', { start: 4, end: 5 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'health',
            frames: this.anims.generateFrameNumbers('user', { start: 6, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        
        this.player.anims.play('run', true);

        // 加入物理效果
        const addPhysics = GameObject =>{
            this.physics.add.existing(GameObject);
            GameObject.body.immovable = true;
            GameObject.body.moves = false;
        }
        addPhysics(this.footer);
        addPhysics(this.footer2);
        addPhysics(this.footer3);

        this.physics.add.collider(this.player, this.footer);
        this.physics.add.collider(this.player, this.footer2);
        this.physics.add.collider(this.player, this.footer3);

        const hittest = () => {
            this.status = 'hit';
            this['trash'+ this.masIdx].destroy();
            this.player.setBounce(0);
            this.player.anims.play('deel', true);
            this.life--;
            this.lifeText.setText(`X ${this.life}`);
            if (this.life <= 0) {
                this.gameStop = true;
                this.gameover1 = this.add.image(w / 2, h / 2, 'gameover1');
                this.playagain = this.add.image(w / 2, h / 2 + 110, 'playagain');
                this.playagain.setInteractive();
                this.playagain.on('pointerdown', () => this.scene.start('gameStart'));
                clearInterval(gametime);
            }
        }
        const hittest2 = () => {
            this.status = 'hit';
            this['trasht'+ this.masIdx2].destroy();
            this.player.setBounce(0);
            this.player.anims.play('deel', true);
            this.life--;
            this.lifeText.setText(`X ${this.life}`);
            if (this.life <= 0) {
                this.gameStop = true;
                this.gameover1 = this.add.image(w / 2, h / 2, 'gameover1');
                this.playagain = this.add.image(w / 2, h / 2 + 110, 'playagain');
                this.playagain.setInteractive();
                this.playagain.on('pointerdown', () => this.scene.start('gameStart'));
                clearInterval(gametime);
            }
        }
        const hittest3 = () => {
            this.status = 'hit';
            this['trashs'+ this.masIdx4].destroy();
            this.player.setBounce(0);
            this.player.anims.play('deel', true);
            this.life--;
            this.lifeText.setText(`X ${this.life}`);
            if (this.life <= 0) {
                this.gameStop = true;
                this.gameover1 = this.add.image(w / 2, h / 2, w, h, 'gameover1');
                this.playagain = this.add.image(w / 2, h / 2 - 100, w, h, 'playagain');
                this.playagain.setInteractive();
                this.playagain.on('pointerdown', () => this.scene.start('gameStart'));
                clearInterval(gametime);
            }
        }
        const health = () => {
            this.status = 'health';
            this['watermother' + this.masIdx3].destroy();
            this.player.anims.play('health', true);
            this.life++;
            if (this.life > 5) return;
            this.lifeText.setText(`X ${this.life}`);
        }
        
        // 產生怪物
        for (let i = 0; i < 10; i++) {
            let BoolIdx = getRandom(3, 0);
            let BoolIdx2 = getRandom(3, 0);
            let BoolIdx3 = getRandom(3, 0);
            const masPos = [
                {name: 'trash1', x: w + 300, y: h / 2 + getRandom(150, -300), w: 75, h: 40},
                {name: 'trash2', x: w + 300, y: h / 2 + getRandom(150, -300) , w: 40, h: 40},
                {name: 'trash3', x: w + 300, y: h / 2 + getRandom(150, -300), w: 80, h: 100},
                {name: 'trash4', x: w + 300, y: h / 2 + getRandom(150, -300), w: 150, h: 160},
            ]
            const masPos2 = [
                {name: 'trash1', x: w + 300, y: h / 2 + getRandom(150, -300), w: 75, h: 40},
                {name: 'trash2', x: w + 300, y: h / 2 + getRandom(150, -300) , w: 40, h: 40},
                {name: 'trash3', x: w + 300, y: h / 2 + getRandom(150, -300), w: 80, h: 100},
                {name: 'trash4', x: w + 300, y: h / 2 + getRandom(150, -300), w: 150, h: 160},
            ]
            const masPos3 = [
                {name: 'trash1', x: w + 300, y: h / 2 + getRandom(150, -300), w: 75, h: 40},
                {name: 'trash2', x: w + 300, y: h / 2 + getRandom(150, -300) , w: 40, h: 40},
                {name: 'trash3', x: w + 300, y: h / 2 + getRandom(150, -300), w: 80, h: 100},
                {name: 'trash4', x: w + 300, y: h / 2 + getRandom(150, -300), w: 150, h: 160},
            ]
            this['trash'+ i] = this.add.tileSprite(masPos[BoolIdx].x, masPos[BoolIdx].y, masPos[BoolIdx].w, masPos[BoolIdx].h, masPos[BoolIdx].name);
            this['trasht'+ i] = this.add.tileSprite(masPos2[BoolIdx2].x, masPos2[BoolIdx2].y, masPos2[BoolIdx2].w, masPos2[BoolIdx2].h, masPos2[BoolIdx2].name);
            this['trashs'+ i] = this.add.tileSprite(masPos3[BoolIdx3].x, masPos3[BoolIdx3].y, masPos3[BoolIdx3].w, masPos3[BoolIdx3].h, masPos3[BoolIdx3].name);
            this.monsterArr.push(this['trash'+ i]);
            this.monsterArrt.push(this['trasht'+ i]);
            this.monsterArrs.push(this['trashs'+ i])
            addPhysics(this['trash'+i]);
            addPhysics(this['trasht'+i]);
            addPhysics(this['trashs'+i]);
            this.physics.add.collider(this.player, this['trash'+ i], hittest);
            this.physics.add.collider(this.player, this['trasht'+ i], hittest2);
            this.physics.add.collider(this.player, this['trash3'+ i], hittest3);
        }

        for (let i = 0; i < 10; i++) {
            const water = {
                x: w + 300,
                y: h / 2 + getRandom(250, -400),
                w: 55,
                h: 75,
            }
            this['watermother' + i] = this.add.tileSprite(water.x, water.y, water.w, water.h, 'watermother');
            this.healthArr.push(this['watermother' + i]);
            addPhysics(this['watermother' + i]);
            this.physics.add.collider(this.player, this['watermother' + i], health);
        }
    },
    update: function(){
        // 遊戲狀態更新
        if (this.gameStop) return;
        this.monsterArr[this.masIdx].x -= 3;
        this.monsterArrt[this.masIdx2].x -= 5;
        this.footer.tilePositionX += 2;
        this.footer2.tilePositionX += 2;
        this.footer3.tilePositionX += 2;

        if (this.TimeStep < 60 && this.TimeStep >= 30) {
            this.monsterArr[this.masIdx].x -= 4;
            this.monsterArrt[this.masIdx2].x -= 6;
            this.monsterArrs[this.masIdx4].x -= 6;
            this.footer.destroy(true);
            this.playbg.destroy(true);
            this.playbg2.x = w / 2;
            this.footer2.x = w / 2;
        } else if (this.TimeStep < 30 && this.TimeStep > 0) {
            this.monsterArr[this.masIdx].x -= 5;
            this.monsterArrt[this.masIdx2].x -= 7;
            this.monsterArrs[this.masIdx4].x -= 8;
            this.healthArr[this.masIdx3].x -= 7;
            this.footer2.destroy(true);
            this.playbg2.destroy(true);
            this.playbg3.x = w / 2;
            this.footer3.x = w / 2;
        }

        for (let i = 0; i < this.healthArr.length; i++) {
            if(this.healthArr[i].x <= -200){
                this.healthArr[i].x = w + 300;
                this.masIdx3 = getRandom(this.healthArr.length - 1, 0);
            }
        }

        for (let i = 0; i < this.monsterArr.length; i++) {
            if(this.monsterArr[i].x <= -200){
                this.monsterArr[i].x = w + 200;
                this.masIdx = getRandom(this.monsterArr.length - 1, 0);
            }
        }
        for (let i = 0; i < this.monsterArrt.length; i++) {
            if(this.monsterArrt[i].x <= -200){
                this.monsterArrt[i].x = w + getRandom(400, 200);
                this.masIdx2 = getRandom(this.monsterArrt.length - 1, 0);
            }
        }
        for (let i = 0; i < this.monsterArrs.length; i++) {
            if(this.monsterArrs[i].x <= -200){
                this.monsterArrs[i].x = w + getRandom(400, 200);
                this.masIdx4 = getRandom(this.monsterArrs.length - 1, 0);
            }
        }

        const stopSetTime = (anim) => {
            this.player.anims.play(anim, true);
            setTimeout(() => {
                this.status = '';
            }, 2000);
        };

         // 啟動鍵盤事件
         let cursors = this.input.keyboard.createCursorKeys();
         if (cursors.right.isDown) {
            if (this.status === 'hit') {
                stopSetTime('deel');
            } else if (this.status === 'health') {
                stopSetTime('health');
            } else {
                this.player.anims.play('runing', true);
            }
            this.player.flipX = false;
            this.player.setVelocityX(300);
         } else if (cursors.left.isDown) {
            if (this.status === 'hit') {
                stopSetTime('deel');
            } else if (this.status === 'health') {
                stopSetTime('health');
            } else {
                this.player.anims.play('runing', true);
            }
            this.player.flipX = true;
            this.player.setVelocityX(-300);
         } else {
            if (this.status === 'hit') {
                stopSetTime('deel');
            } else if (this.status === 'health') {
                stopSetTime('health');
            } else {
                this.player.anims.play('run', true);
            }
            this.player.flipX = false;
            this.player.setVelocityX(0);
         }
         if (cursors.up.isDown) {
            if(this.iskeyJump){
                this.iskeyJump = false;
                this.player.setVelocityY(-300);
            }
         } else if (cursors.down.isDown) {
            this.player.setVelocityY(300);
         }
         else{
            this.iskeyJump = true;
            this.player.setVelocityY(0);
         }
    }
}