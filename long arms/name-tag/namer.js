(() => {

if (window.hasRun) {
    return;
}
window.hasRun = true;

window.og_title = document.title;


function setTitle(title) {
    document.title = title;
}

function getTitle(tabs) {
    let title = document.title;

    browser.tabs.sendMessage(tabs[0].id, {
        command: "returnTitle",
        title: title,
    });
}

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "setTitle") {
        setTitle(message.title);
    } else if (message.command === "getTitle") {
        browser.tabs
            .query({ active: true, currentWindow: true })
            .then(getTitle)
            .catch(reportError);
    }
});


})();