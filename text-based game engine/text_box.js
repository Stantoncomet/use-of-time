// Command stuff
let cmd_prefix = '<span class="green">Enter action: </span><span class="user-input">';
let cmd_suffix = '<span id="text-cursor">|</span></span>';
let CMD = new UserInput(cmd_prefix, cmd_suffix);

document.addEventListener('DOMContentLoaded', e => {
    START_MSG.forEach(line => printToBox(line));
    document.getElementById('cmd-line').innerHTML = CMD.getDisplay(); // Command contents will be empty herew
})

// Typing and deleting text in terminal
document.addEventListener('keydown', e => {
    // If key is a letter or number, not weird
    if (e.key.length == 1) {
        CMD.value += e.key;
    } else {
        switch (e.key) {
            case 'Backspace': {
                CMD.backspace();
                break;
            }
            case 'Enter': {
                preProcessCMD();
                break;
            }
        }
    }
    //colorKeyWords();

    document.getElementById('cmd-line').innerHTML = CMD.getDisplay();
})

function printToBox(msg) {
    let newText = document.createElement('p');
    newText.classList.add('line');
    newText.classList.add('feedback');
    //newText.classList.add('new-line'); // Fade new line in
    newText.innerHTML = msg;

    document.getElementById('past-cmds').prepend(newText);

    clearOld();
}



function clearOld() {
    let past_lines = document.getElementsByClassName('line');
    if (past_lines.length > 16) {
        document.getElementById('past-cmds').removeChild(past_lines[past_lines.length-1]);
    }
}

function colorKeyWords() {
    let cmd = CMD.value.trim().toLocaleLowerCase();
    if (cmd == "shop") {
        cmd_prefix += '<span class="valid-cmd">';
        cmd_suffix = '</span>' + cmd_suffix;
    } else {
        cmd_prefix = cmd_prefix.replace('<span class="valid-cmd">', '');
        cmd_suffix = cmd_suffix.replace('</span>', '');
    }
}

// Re-defined in other file (tools.js)
function preProcessCMD() {};