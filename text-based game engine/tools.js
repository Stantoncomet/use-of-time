/**
 * Defines how to process user input.
 * - default
 * - shop
 * - shop-confirm
 */
let input_mode = 'default';

// Known commands
const START_MSG = ["Welcome to a text-based game engine!", "Type 'help' for help."]
const actions = {

}

function preProcessCmd(cmd = command) {
    let pCmd = cmd.trim().toLocaleLowerCase(); // Clear trailing spaces and make non-case sensitive
    printToBox(disCmd().slice(0, disCmd().length - cmd_suffix.length)); // Print command to box
    command = ""; // Clear user input
    if (pCmd == "") { return; } // Don't process if command is empty
    
    switch (input_mode) {
        case 'default': {
            processCmdDefault(pCmd);
            break;
        }
        case 'shop': {
            processCmdShop(pCmd);
            break;
        }
        case 'shop-confirm': {
            processCmdShopConfirm(cmd);
            break;
        }
    }

    processCmdAlwaysAvailable(pCmd);


    
}

function processCmdDefault(cmd) {
    switch (cmd) {
        case 'shop': {
            input_mode = 'shop';
            cmd_prefix = '<span class="green">Enter item to buy: </span><span class="user-input">';
            showShop();
            printToBox("Shopkeeper: What oh! Today is 'Apple Day'!");

            break;
        }

        default: {
            noSuchCmd(cmd);
        }
    }
}

function processCmdShop(cmd) {
    let sale_id = Number(cmd).toFixed(0);
    if (Number.isNaN(Number(cmd)) || sale_id > shop_items.length || sale_id < 1) {
        printToBox("Entry does not exist, type 'exit' to leave shop.");
        return;
    }
    let sale_item = shop_items[sale_id-1];
    console.log(sale_item.item.name, shop_items.length);
    
    //input_mode = 'default';
    //cmd_prefix = '<span class="green">Enter action: </span><span class="user-input">';
    //printToBox("Insuffiecent funds; Exitting shop...");

    input_mode = 'shop-confirm';
    cmd_prefix = '<span class="green">Confirm purchase? </span><span class="user-input">';
    
    //showShop();
}

function processCmdShopConfirm(cmd) {
    if (cmd == 'y' || cmd == 'yes') {

    }
    input_mode = 'shop';
    cmd_prefix = '<span class="green">Enter item to buy: </span><span class="user-input">';
    showShop();
}

function showShop() {
    const msg = [ "============[SHOP]============" ];
    //msg.push(     "1> Stone....................5g");
    shop_items.forEach((sale, index) => {
        let line = index+1 + "> " + sale.item.name;
        
        // The dots between name and cost
        let dots = "";
        for (let i = 0; i < msg[0].length - (line.length + sale.cost.toString().length + CURRENCY_PREFIX.length); i++) {
            dots += ".";
        }

        line += dots;
        line += sale.cost;
        line += CURRENCY_PREFIX;
        //console.log(line);
        msg.push(line);
    })
    msg.push("==============================");
    //msg.push("Shopkeeper: What oh! Today is 'Apple Day'!");
    msg.forEach(line => printToBox(line));
}

function processCmdAlwaysAvailable(cmd) {
    switch (cmd) {
        case 'items':
        case 'inv':
        case 'inventory':
        case 'pack':
        case 'backpack': {
            let msg = [ "==========[Backpack]==========",
                        "1x Apple",
                        "1x Sharpened Stick [w]",
                        "1x Moldy Hat [a]",
                        "==============================" ];
            msg.forEach(line => printToBox(line)); 
            break;
        }

        case 'help': {
            printToBox("Available actions:");
            printToBox("shop, help");   
            break;
        }
    }
}

function noSuchCmd(cmd) {
    printToBox("Yeah, no such command as: "+cmd);
}

