import Phaser from 'phaser';
import SimpleButton from '../Objects/Objects.js';
import stageinfo from '../stage/stageinfo.json';

class SceneTitle extends Phaser.Scene {
    constructor(){
        super({key:"title"});
    }
    preload(){}
    create(){
        this.game.scale.setGameSize(800, 600);
        this.add.text(200, 100, 'プログラミング教室', {fontSize: 50, color: 'red'});
        for (let index = 0; index < stageinfo.stages.length; index++) {
            var startButton=new SimpleButton(this, 100, 200+50*index, 200, 50, 0xfffff00, "STAGE"+index, "red")
            var discription=new SimpleButton(this, 100, 200+50*index, 200, 10, 0xfffff00, stageinfo.stages[index].description, "black")
            startButton.button.on('pointerdown', function(){
                this.scene.start("game",{stage_num:index});
            }.bind(this));
        }
        //いらないボタンなどを隠す(クソ実装)
        const executeButton = document.getElementById("executeButton");
        executeButton.style.visibility="hidden";
        const playerChangeButton = document.getElementById("playerChangeButton");
        playerChangeButton.style.visibility="hidden";
        const blocklyDiv = document.getElementById("blocklyDiv");
        blocklyDiv.style.visibility="hidden";
    }
    update(){}
} 
export default SceneTitle;