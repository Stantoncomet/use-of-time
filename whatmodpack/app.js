// array of a bunch of objects returned from calling the modrinth api
let all_mods = [];

//
async function load() {
    document.getElementById('loading').innerText = "Fetching content...";

    let html_list = valOfId('ml-input')
    // parse the html file from prism modlist export to get a list of the project ids
    let mod_list = html_list
        .replaceAll('<html><body><ul>','')
        .replaceAll('</ul></body></html>','')
        .replaceAll('<li><a href="','')
        .replaceAll('</a></li>','')
        .replaceAll('">',';')
        .trim()
    
    // get rid of wierd html artifacts and character entities or whatever
    let parser = new DOMParser();
    mod_list = parser.parseFromString(mod_list, 'text/html').documentElement.innerText;

    // split into array
    mod_list = mod_list.split(' 	');

    
    // clear old mods
    all_mods = [];

    let failed_count = 0;
    // fetch a bunch of promises that have been fulfilled or rejected
    let all_mod_proms = await getModInfo(mod_list)
    // only take fulfilled ones and get data
    all_mod_proms.forEach(p => {
        if (p.status == 'fulfilled') {
            all_mods.push(p.value);
            if (p.value.api_failed) {
                console.warn(`Problem loading mod ${p.value.title}. Error: ${p.value.error}`);
            }
        } else {
            console.warn(`Failed to load a mod. ${p.reason}`);
            failed_count++;
        }
    })

    if (failed_count > 0)
        document.getElementById('net-info').innerText = ` (Failed: ${failed_count})`;

    displayShit();
}

// fetch mods using modrinth api
// creates an array of promises so it's fast and runs parallel or smth
async function getModInfo(mod_list) {

    // use map instead of foreach because the latter doesnt like await stuff :((
    let mod_proms = mod_list.map(async mod => {
        //split the mod array item to get the url, then spit that by / to get the id
        let mod_url = mod.split(';')[0];
        let mod_title = mod.split(';')[1];
        if (!mod_title) mod_title = "missingo";
        //check for not modrinth mods
        if (mod_url.split('/')[2] != 'modrinth.com') {
            return {title:mod_title, source_url:mod_url, api_failed:true, error:"Not Modrinth mod"};
        }
        
        let mod_id = mod_url.split('/')[4];
        let res = await fetch(`https://api.modrinth.com/v2/project/${mod_id}`);
        return res.json().catch(() => {return {title:mod_title, source_url:mod_url, api_failed:true, error:"Modrinth project not found"}});

    })

    return Promise.allSettled(mod_proms)
}

// give each mod a "track" that's displayed on page
// tracks have an icon, title, and description
function displayShit() {
    hideEle('loading');

    // remove any old tracks
    document.getElementById('modlist').querySelectorAll('.track').forEach(t => t.remove())

    all_mods.forEach(mod => {
        console.info(`Loading Mod ${mod.title}`)

        // parent elements
        let Track = new DocEle('div');
        Track.addClass('track');
        let Title = new DocEle('div');
        Title.addClass('title');

        // just end it here if no more info can be gathered
        if (mod.is_not_modrinth_mod) {
            Title.newChild('h1', mod.title);
            Track.appendChild(Title.ele);
            Track.newChild('p', `<a href="${mod.source_url}">${mod.source_url}</a>`)
            Track.appendToId('modlist');
            return;
        }

        Track.setId(`mod-${mod.id}`);

        // icon is also the hyperlink to mod page
        let Img = new DocEle('a');
        Img.ele.href = `https://modrinth.com/mod/${mod.id}`;
        Img.ele.setAttribute('target', "_blank")
        Img.newChild('img', "", c => {
            c.addClass('icon');
            c.ele.src = mod.icon_url;
            return c;
        });

        // append icon and title to Title div
        Title.appendChild(Img.ele)
        Title.newChild('h1', mod.title);
        
        // append everything to the main Track div
        Track.appendChild(Title.ele);
        Track.newChild('p', mod.description);
        
        // add Track to page
        Track.appendToId('modlist');
    })

    // for good measure
    filterList(cur_filter);
}



let cur_filter = 'all';


// filter buttons to sort tracks
function filterList(filter) {
    cur_filter = filter;
    let tracks = document.querySelectorAll('.track')

    let show_libs = !document.getElementById('lib-tog').checked;
    console.log(show_libs)

    let display_mod_count = 0;

    // just clear network errors and stuff after first display
    if (filter != 'all')
        document.getElementById('net-info').innerText = "";

    switch (filter) {
        case 'all': {
            if (show_libs) {
                showAll();
                display_mod_count = all_mods.length;
            } else {
                hideAll();
                all_mods.forEach(mod => {
                    if (mod.categories && !mod.categories.includes('library')) {
                        showEle(`mod-${mod.id}`);
                        display_mod_count++;
                    }
                })
            }
            break;
        }

        case 'client': {
            hideAll();
            all_mods.forEach(mod => {
                if (((mod.server_side == 'optional' || mod.server_side == 'unsupported')) && ((mod.categories.includes('library') && show_libs) || (!mod.categories.includes('library')))) {
                    showEle(`mod-${mod.id}`);
                    display_mod_count++;
                }
            })
            break;
        }

        case 'server': {
            hideAll();
            all_mods.forEach(mod => {
                if ((mod.server_side == 'required') && ((mod.categories.includes('library') && show_libs) || (!mod.categories.includes('library')))) {
                    showEle(`mod-${mod.id}`);
                    display_mod_count++;
                }
            })
            break;
        }

        default: {

        }
    }

    document.getElementById('mod-count').innerText = `Shown: ${display_mod_count}`;
}



// more helpers 
function hideAll() {
    let tracks = document.querySelectorAll('.track');
    tracks.forEach(t => {
        t.style.visibility = 'hidden';
        t.style.display = 'none';
    })
}

function showAll() {
    let tracks = document.querySelectorAll('.track');
    tracks.forEach(t => {
        t.style.visibility = 'visible';
        t.style.display = 'block';
    })
}