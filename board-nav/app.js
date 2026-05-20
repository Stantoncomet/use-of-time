//
let is_on = false;

// time since k press
let last_press = Date.now();
document.addEventListener('keypress', e => {
    // only detect k
    if (e.key != "k") return;
    
    let diff = Date.now() - last_press;
    // update indicator
    document.getElementById('time-since').innerText = diff;
    // update last press
    last_press = Date.now();
    // only run if second press is less than 200ms from first
    if (diff < 200)
        toggleNav();
})


document.addEventListener('keypress', e => {
    if (!is_on) return;

    let desired = document.querySelector(`.board-nav-${e.key}`);

    desired.querySelector('.indicator').style.color = 'lightgreen';

    // if its a link
    if (desired.hasAttribute('href'))
        desired.click();
    // if its a button
    if (desired.tagName == "BUTTON") {
        desired.click();
        desired.querySelector('.indicator').style.color = 'red';
    }
})

function toggleNav() {
    is_on = !is_on;
    // and update display
    document.getElementById('enable').innerText = is_on ? "Yes" : "No";

    if (is_on) {
        // show labels
        document.querySelectorAll('.indicator').forEach(e => {
            showEle(e);
        })
    } else {
        // hide labels
        document.querySelectorAll('.indicator').forEach(e => {
            hideEle(e);
        })
    }
}




function loadLabels() {
    
    // get every button and link
    let targets = {
        links: document.querySelectorAll('a'),
        buttons: document.querySelectorAll('button')
    }

    // for each, assign a unique a-z indentifier
    targets.links.forEach((e, i) => {
        // index to alpha
        let id = String.fromCharCode(97+i)
        // add it to a class
        e.classList.add(`board-nav-${id}`);
        // do css stuff
        e.style.position = 'relative';
        // add child
        let child = new DocEle('p');
        child.addClass('indicator');
        child.setText(id);
        child.appendToEle(e);
    })
    // contiune the id labeling from where it was left off
    let target_count = targets.links.length;


    // repeat for buttons (there's probably a better way to do this, but it's just a proof of concept -.-)
    targets.buttons.forEach((e, i) => {
        // index to alpha
        let id = String.fromCharCode(97+target_count+i)
        // add it to a class
        e.classList.add(`board-nav-${id}`);
        // do css stuff
        e.style.position = 'relative';
        // add child
        let child = new DocEle('p');
        child.addClass('indicator');
        child.setText(id);
        child.appendToEle(e);
    })

    // for each, add a little div with its identifier
    // (div is offset visually)
    
}




document.addEventListener('DOMContentLoaded', () => loadLabels());