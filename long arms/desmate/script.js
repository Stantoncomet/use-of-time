let socket;
let msg_ele = document.getElementById('msg');
let eor_ele = document.getElementById('auto_exe');

function serverConnect() {
    setStatus('trying');

    let addr = document.getElementById('addr').value;
    if (addr.length == 0) addr = "ws://127.0.0.1:7000";
    // let addr = input.split(":")[0];
    // let port = input.split(":")[1];
    

    socket = new WebSocket(addr);
    socket.onopen = e => {
        //alert("connected!");
        setStatus('yep');
    }
    socket.onmessage = e => {
        console.log("msg recieved");
        msg_ele.innerText = e.data;
        if (eor_ele.checked) execute();
    }
    socket.onclose = e => {
        alert("[Desmate]\nWebSocket Connection Lost!");
        setStatus('nope');
    }
    
}

function serverDisconnect() {
    socket.close();
}

function execute() {
    eval(msg_ele.innerText);

    //location.reload();
}


let status_ele = document.getElementById('status');
function setStatus(status='yep') {
    status_ele.classList.remove('nope','trying','yep');
    status_ele.classList.add(status);
    status = status[0].toUpperCase()+status.slice(1);
    status_ele.innerText = status;
}


// UGUUHGHH

document.getElementById('serverConnect').onclick = () => serverConnect();
document.getElementById('serverDisconnect').onclick = () => serverDisconnect();
document.getElementById('execute').onclick = () => execute();