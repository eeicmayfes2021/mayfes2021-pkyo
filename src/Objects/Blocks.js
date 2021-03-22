import Blockly, { CollapsibleToolboxCategory__Class } from 'blockly';

Blockly.Blocks['move'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Move")
          .appendField(new Blockly.FieldDropdown([["→", "0"],["←", "1"],["↑", "2"],["↓", "3"]]), "move_direction");
      this.setNextStatement(true);
      this.setPreviousStatement(true);
      this.setColour(270);
      this.setTooltip("");
      this.setHelpUrl("");
    }
};
  Blockly.JavaScript['move'] = function(block) {
    var dropdown_direction = block.getFieldValue('move_direction');
    var code = `this.tryMove(this.player,${dropdown_direction});yield "${block.id}";\n`;
    return code;
  };
  Blockly.Blocks['while'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabelSerializable("この中をくりかえします"), "string");
      this.appendStatementInput("NAME")
          .setCheck(null);
      this.setColour(230);
      this.setTooltip("");
      this.setHelpUrl("");
    }
  };
  Blockly.JavaScript['while'] = function(block) {
    var childblock=Blockly.JavaScript.statementToCode(block, 'NAME');
    var code = `while(true){${childblock}}\n`;
    return code;
  };

  Blockly.Blocks['remove'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("岩を取り除く")
      this.setNextStatement(true);
      this.setPreviousStatement(true);
      this.setColour(300);
      this.setTooltip("");
      this.setHelpUrl("");
    }
};
  Blockly.JavaScript['remove'] = function(block) {
    var code = `this.removeObstacle(this.player);yield "${block.id}";\n`;
    return code;
  };
