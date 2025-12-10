function doStuff() {
    console.log('do stuff')
    
    function apply(tabs) {
        let title = document.getElementById('title').value;

        browser.tabs.sendMessage(tabs[0].id, {
            command: "setTitle",
            title: title,
        });
    }

    browser.tabs
        .query({ active: true, currentWindow: true })
        .then(apply)
        .catch(reportError);
}

async function doLoad() {
    function getTitle(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {
            command: "getTitle"
        });
    }

    await browser.tabs
        .query({ active: true, currentWindow: true })
        .then(getTitle)
        .catch(reportError);

    console.log('requesing title')
}


async function listenForClicks() {
    await doLoad()
    document.getElementById('apply').addEventListener('click', e => doStuff())
    document.getElementById('title').addEventListener('keypress', e => doStuff())
    //document.addEventListener('load', e => doLoad())


}

function setInput(title) {
    document.getElementById('title').value = title;
}



browser.tabs
    .executeScript({ file: "./namer.js" })
    .then(listenForClicks);


browser.runtime.onMessage.addListener((message) => {
    if (message.command === "returnTitle") {
        setInput(message.title);
    }
});