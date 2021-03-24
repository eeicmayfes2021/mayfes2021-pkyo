import Blockly, { CollapsibleToolboxCategory__Class } from 'blockly';
import Phaser from 'phaser';
import SceneTitle from './Scenes/SceneTitle';
import SceneGame from './Scenes/SceneGame';
import {SimpleButton, Simpleimage} from './Objects/Objects.js';
require('./Objects/Blocks.js');
//import xmlFile1 from '../Blockly/test.xml';
//import BlocklyRunner from '../Blockly/BlocklyRunner.js';
var config = {
    type: Phaser.AUTO,
    width: 30*16,
    height: 30*20,
    parent: 'phaserDiv',
    physics:{
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: 0,
            },
            debug: false,
        }
    },
    //ここにシーンを追加(preloadとかはここで定義しなくても良い)
    scene: [
        SceneTitle,
        SceneGame
    ],
    render: {
        transparent: true,
    },
};

const blocklyDiv = document.getElementById("blocklyDiv");
blocklyDiv.style.left = config.width;
var game = new Phaser.Game(config);