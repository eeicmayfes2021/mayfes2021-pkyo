import Phaser from 'phaser';
import SimpleButton from '../Objects/Objects.js';

class SceneTitle extends Phaser.Scene {
    constructor(){
        super({key:"title"});
    }
    preload(){}
    create(){
        this.game.scale.setGameSize(800, 600);
        this.add.text(200, 100, 'プログラミング教室', {fontSize: 50, color: 'red'});
        var startButton=new SimpleButton(this, 100, 200, 150, 50, 0xfffff00, "START", "red")
        startButton.button.on('pointerdown', function(){
            this.scene.start("game");
        }.bind(this));
        //いらないボタンなどを隠す(クソ実装)
        const executeButton = document.getElementById("executeButton");
        executeButton.style.visibility="hidden";
        const blocklyDiv = document.getElementById("blocklyDiv");
        blocklyDiv.style.visibility="hidden";
    }
    update(){}
} 
export default SceneTitle;