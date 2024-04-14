// Command stuff
let cmd_prefix = '<span class="green">Enter action: </span><span class="user-input">';
let cmd_suffix = '<span id="text-cursor">|</span></span>';
let command = "";

document.addEventListener('DOMContentLoaded', e => {
    START_MSG.forEach(line => printToBox(line));
    document.getElementById('cmd-line').innerHTML = disCmd(); // Command contents will be empty herew
})

// Typing and deleting text in terminal
document.addEventListener('keydown', e => {
    // If key is a letter or number, not weird
    if (e.key.length == 1) {
        command += e.key;
    } else {
        switch (e.key) {
            case 'Backspace': {
                command = command.slice(0, command.length-1);
                break;
            }
            case 'Enter': {
                preProcessCmd();
                break;
            }
        }
    }
    //colorKeyWords();

    document.getElementById('cmd-line').innerHTML = disCmd();
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

/**
 * Returns the command string to display, pre + cmd + suf
 */ 
function disCmd(cmd = command) {
    return cmd_prefix + cmd + cmd_suffix;
}

function clearOld() {
    let past_lines = document.getElementsByClassName('line');
    if (past_lines.length > 16) {
        document.getElementById('past-cmds').removeChild(past_lines[past_lines.length-1]);
    }
}

function colorKeyWords(cmd = command) {
    cmd = cmd.trim().toLocaleLowerCase();
    if (cmd == "shop") {
        cmd_prefix += '<span class="valid-cmd">';
        cmd_suffix = '</span>' + cmd_suffix;
    } else {
        cmd_prefix = cmd_prefix.replace('<span class="valid-cmd">', '');
        cmd_suffix = cmd_suffix.replace('</span>', '');
    }
}

