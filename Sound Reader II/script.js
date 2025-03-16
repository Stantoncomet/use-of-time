

const fileInput = document.getElementById('folder-input');

fileInput.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log("Loading new folder:");
    console.log(event.target.name);
});
document.addEventListener('DOMContentLoaded', e => {
    console.log("Loading last folder:");
    console.log(fileInput.container);
})


function loadPage(page_id, page_tab) {
    // Loop through every page on desk and set as loaded or unloaded
    const AllPages = document.querySelectorAll('#desk .page');
    AllPages.forEach(page => {
        if (page.id.includes(page_id)) {
            page.classList.remove('unloaded-page');
            page.classList.add('loaded-page');
        } else {
            page.classList.remove('loaded-page');
            page.classList.add('unloaded-page');
        }
    })
    // Similar thing with the tabs
    const AllTabs = document.querySelectorAll('#tabs button');
    AllTabs.forEach(tab => {
        tab.classList.remove('selected');
    })
    page_tab.classList.add('selected');
}

function createPage(page_id, tab_name) {
    // Create page container
    let page_div = document.createElement('div');
    // Notate it
    page_div.classList.add('page');
    page_div.classList.add('unloaded-page');
    page_div.id = page_id;

    // Tab
    let tab_btn = document.createElement('button');
    tab_btn.innerText = tab_name;
    // Give it function
    tab_btn.setAttribute('onclick', `loadPage(${page_id}, this)`);

    // Finally appened children
    document.getElementById('desk').appendChild(page_div);
    document.getElementById('tabs').appendChild(tab_btn);


}

function createTrack() {

}
