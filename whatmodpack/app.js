let all_mods = [];
async function load() {
    document.getElementById('loading').innerText = "Fetching content...";

    let html_list = valOfId('ml-input')
    // parse the html file from prism modlist export
    let mod_list = html_list
        .replaceAll('<html><body><ul>','')
        .replaceAll('</ul></body></html>','')
        .replaceAll('<li><a href="','')
        .replaceAll('</a></li>','')
        .replaceAll('">',';')
        .trim()
        .split(' 	')


    let fetch_success = true;
    all_mods = await getModInfo(mod_list).catch(e => {
        console.log(e);
        document.getElementById('loading').innerText = "Network error :p";
        fetch_success = false;
    })
    //console.log(mods)
    if (fetch_success)
        displayShit();
}


async function getModInfo(mod_list) {

    // use for loop instead of foreach because the latter doesnt like await stuff :((
    // actually no use map instead?
    let mods = mod_list.map(async mod => {
        //update loading progress thingy
        //document.getElementById('loading').innerText = `Loading ${mod.split(';')[1]} (${i}/${mod_list.length})`;
        //split the mod array item to get the url, then spit that by / to get the id
        let mod_url = mod.split(';')[0];
        //check for not modrinth mods
        if (mod_url.split('/')[2] != 'modrinth.com') {
            return {title:mod.split(';')[1], source_url:mod_url, is_not_modrinth_mod:true};
        }
        
        let mod_id = mod_url.split('/')[4];
        let res = await fetch(`https://api.modrinth.com/v2/project/${mod_id}`);
        return res.json();
        
        //mods.push("e")
    })

    //document.getElementById('loading').innerText = `Done Loading ${mods.length}/${mod_list.length}`;
    return Promise.all(mods)
}


function displayShit() {
    hideEle('loading');

    all_mods.forEach(mod => {
        console.info(`Loading Mod ${mod.title}`)

        let Track = new DocEle('div');
        Track.addClass('track');
        let Title = new DocEle('div');
        Title.addClass('title');

        // just end it here if no more info can be gathered
        if (mod.is_not_modrinth_mod) {
            Track.newChild('h1', mod.title);
            Track.newChild('p', `<a href="${mod.source_url}">${mod.source_url}</a>`)
            Track.appendToId('modlist');
            return;
        }

        Track.setId(`mod-${mod.id}`);

        let Img = new DocEle('a');
        Img.ele.href = `https://modrinth.com/mod/${mod.id}`;
        Img.ele.setAttribute('target', "_blank")
        Img.newChild('img', "", c => {
            c.addClass('icon');
            c.ele.src = mod.icon_url;
            return c;
        });
        Title.appendChild(Img.ele)

        Title.newChild('h1', mod.title);

        Track.appendChild(Title.ele);
        Track.newChild('p', mod.description);
        
        Track.appendToId('modlist');
    })

    // for good measure
    filterList(cur_filter);
}



let cur_filter = 'all';

function filterList(filter) {
    cur_filter = filter;
    let tracks = document.querySelectorAll('.track')

    let show_libs = !document.getElementById('lib-tog').checked;
    console.log(show_libs)

    let display_mod_count = 0;

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