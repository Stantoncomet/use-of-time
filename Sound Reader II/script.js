const Desk = document.getElementById('desk');
const Tabs = document.getElementById('tabs');
const Toast = document.getElementById('toast');
const TestTrack = document.getElementById('test-track');

const AudioInput = document.getElementById('folder-input');
let audio_files = []; // array of full paths to files
let audio_directory = "";
const ValidSounds = ['mp3', 'wav', 'ogg'];

let audio_tree = {
    "homeless": []
}

let persistant_data = {
    shipped_tracks: {
        // template
        // "": {
        //     page_id: "",
        //     stack_index: 0
        // }
    }
}


AudioInput.addEventListener('change', async e => {
    await loadAudio();
});
document.addEventListener('DOMContentLoaded', async e => {
    fetchPersistance();
    await loadAudio();
})


// Audio

async function loadAudio() {
    console.log("SOUND LOADING IN PROGRESS");
    let file_list = AudioInput.files;
    if (!file_list.length) {
        console.log("Can't remember last folder");
        waveToast("Amnesia Warning", "I couldn't remember the last <u>audio folder</u> you opened, please choose one!", 'meh');
        return;
    }

    // Erase old audios and pages
    audio_files = [];
    let current_pages = Desk.querySelectorAll('.page');
    let current_tabs = Tabs.querySelectorAll('button');
    if (current_pages.length > 2) {
        for (let i = 2; i < current_pages.length; i++) { // dont delete home or homeless tabs
            current_pages[i].remove();
            current_tabs[i].remove();
        }
    }

    for (let i = 0; i < file_list.length; i++) {
        audio_files.push(file_list[i].webkitRelativePath);
    }


    // try {
    //     await (TestTrack.src = audio_files[0]);
    //     await TestTrack.play();
    // } catch (error) {
    //     console.log(error)
    //     waveToast("Bad Audio", "I can't load the audio in the folder you selected", 'error');
    //     return;
    // }
    


    // Splits the full path string into array of folders/files and takes the first one, which is the top-most directory
    audio_directory = audio_files[0].split('/')[0];
    let valid_sound_count = 0;

    // Organize and check audio tracks

    // made global
    // let audio_tree = {
    //     "homeless": []
    // }
    let og_tab_names = {}

    audio_files.forEach(path => {
        let path_array = path.split('/');
        let a_name = path_array[path_array.length-1];
        //console.log(a_name)

        // Not a track
        let a_name_array = a_name.split('.');
        let a_type = a_name_array[a_name_array.length-1];
        let is_valid_sound = false;
        ValidSounds.forEach(t => {
            if (t == a_type) is_valid_sound = true;
        })

        if (a_name_array.length < 2 || !is_valid_sound) {
            console.log("Skipping "+path+". Not of valid sound type.");
            return;
        }

        // Path too long
        if (path_array.length > 3) {
            console.log("Skipping "+path+". Path invalid.");
            return;
        }

        // Homeless track
        if (path_array.length < 3) {
            audio_tree['homeless'].push(path);

            valid_sound_count++;
            console.log("Loading "+path+" as Homeless.");
            return;
        }

        // Normal
        let og_a_tab = path_array[1];
        let a_tab = og_a_tab.toLowerCase().replace(' ', '-'); // NO SPACES ALLOWED IN FOLDER NAMES
        og_tab_names[a_tab] = og_a_tab;

        if (!audio_tree[a_tab]) audio_tree[a_tab] = [];
        audio_tree[a_tab].push(path);

        valid_sound_count++;
        console.log("Loading "+path+" as normal.");
        
    })
    console.log(audio_tree);
    console.log(og_tab_names)
    // Create pages n stuff
    for (let tab in audio_tree) {
        if (tab != "homeless") {
            createPage(tab, og_tab_names[tab]);
            createStack(tab, "All");
            createStack(tab, "DVDs");
            createStack(tab, "Cassettes");
            // createStack(tab, "");
            // createStack(tab, "");
        };
        audio_tree[tab].forEach(path => {
            createTrack(tab, 0, path);
        })
    }

    // Re-ship tracks
    for (let shipment in persistant_data.shipped_tracks) {
        let sd = persistant_data.shipped_tracks[shipment];
        let target = document.getElementById(shipment);
        moveTrack(target, sd.page_id, sd.stack_index);
    }


    waveToast(`Loaded ${valid_sound_count} Tracks`, `I found and loaded tracks from <u>${audio_directory}</u> for you!`, 'success');

    console.log("FINISHED LOADING SOUNDS");
}

function toggleAudio(track_play_btn) {
    // Get the parent/whole track div, since track_play_btn is just the button element
    let track_ele = track_play_btn.parentElement;

    let duration_ele = track_ele.querySelector('.duration');

    /**
     * @type {HTMLInputElement}
     */
    let seeker_ele = track_ele.querySelector('.seeker');

    /**
     * @type {HTMLAudioElement}
     */
    let audio_ele = track_ele.querySelector('audio');
    

    // Update duration and seeker range
    audio_ele.ontimeupdate = () => {
        //ugh
        seeker_ele.max = audio_ele.duration;

        let time_s = "m:s";
        time_s = time_s.replace("m", Math.floor(audio_ele.currentTime/60));
        let secs = Math.floor(audio_ele.currentTime%60);
        if (secs < 10) secs = "0"+secs;
        time_s = time_s.replace("s", secs);

        duration_ele.innerText = time_s;

        // pause audio if end
        if (audio_ele.currentTime >= audio_ele.duration) {
            track_play_btn.innerText = "⯈";
            audio_ele.pause()
        }

        // update seeker
        seeker_ele.value = audio_ele.currentTime;

        

    }

    seeker_ele.onchange = () => {
        audio_ele.currentTime = seeker_ele.value;
    }



    // Update play button and audio
    if (audio_ele.paused) {
        track_play_btn.innerText = "⏸";
        audio_ele.play();
    } else {
        track_play_btn.innerText = "⯈";
        audio_ele.pause();
    }
}

function toggleVolumeControls(track_vol_btn) {
    
}

function setShipment(track_ship_btn, visibility) {
    // Get the parent/whole track div, since track_ship_btn is just the button element
    /**
     * @type {HTMLElement}
     */
    let track_ele = track_ship_btn.parentElement;

    /**
     * @type {HTMLElement}
     */
    let ship_menu_ele = track_ele.querySelector('.shipment');

    
    ship_menu_ele.style.visibility = visibility;

}

function moveTrack(track_ele, page_id, stack_index=0) {
    track_ele.remove();
    document.getElementById(page_id).querySelectorAll('.stack')[stack_index].appendChild(track_ele);
}

function scoochTrack(track_vol_btn, amount) {
    let track_ele = track_vol_btn.parentElement.parentElement;
    let stack_ele = track_ele.parentElement;
    /**
     * @type {HTMLElement}
     */
    let page_ele = stack_ele.parentElement;

    let all_stacks = Array.from(page_ele.querySelectorAll('.stack'));
    let new_stack_index = all_stacks.indexOf(stack_ele) + amount;

    if (new_stack_index < 0 || new_stack_index > all_stacks.length-1)
        new_stack_index -= amount;
         
    // move
    moveTrack(track_ele, page_ele.id, new_stack_index);

    // save
    let shipment = {
        page_id: page_ele.id,
        stack_index: new_stack_index
    }
    persistant_data.shipped_tracks[track_ele.id] = shipment;
    savePersistance();

}

function shipTrack(ship_btn) {
    // Get the parent/whole track div, since track_ship_btn is just the button element
    /**
     * @type {HTMLElement}
     */
    let track_ele = ship_btn.parentElement.parentElement;

    let dest_page_id = ship_btn.innerText;

    ship_btn.parentElement.style.visibility = 'hidden';
    moveTrack(track_ele, dest_page_id);
    

    // Update local storage for persistance
    
    let shipment = {
        page_id: dest_page_id,
        stack_index: 0
    }
    
    persistant_data.shipped_tracks[track_ele.id] = shipment;
    //console.log(persistant_data)
    savePersistance();
    
}

function savePersistance() {
    localStorage.setItem('srii', JSON.stringify(persistant_data));
}

function fetchPersistance() {
    persistant_data = JSON.parse(localStorage.getItem('srii'));
}

function deletePersistance() {
    persistant_data.shipped_tracks = {};
    savePersistance();
    waveToast("FYI", "All persistant data was deleted.", 'meh')
}

// Site strucure building

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

function createPage(page_id, tab_name=page_id) {
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
    tab_btn.setAttribute('onclick', `loadPage('${page_id}', this)`);

    // Finally appened children
    document.getElementById('desk').appendChild(page_div);
    document.getElementById('tabs').appendChild(tab_btn);


}

function createStack(page_id, label="New Stack") {
    // Create stack container
    let stack_div = document.createElement('div');
    // Notate it
    stack_div.classList.add('stack');

    // Label
    let label_div = document.createElement('div');
    let label_p = document.createElement('p');

    label_p.innerText = label;
    // Finally appened children
    label_div.appendChild(label_p);
    stack_div.appendChild(label_div);
    document.getElementById(page_id).appendChild(stack_div);
}

function createTrack(page_id, stack_index=0, src="") {
    let file_name = src.split('/')[src.split('/').length-1];

    // Create track container
    let track_div = document.createElement('div');
    // Notate it
    track_div.classList.add('track');

    // Contents
    let audio_e = document.createElement('audio');
    let move_b = document.createElement('button');
    let name_p = document.createElement('p');
    let volume_d = document.createElement('div');
    let volume_b = document.createElement('button');
    let volume_ba = document.createElement('button');
    let playpause_b = document.createElement('button');
    let seeker_i = document.createElement('input');
    let duration_p = document.createElement('p');
    

    audio_e.setAttribute('src', src);
    move_b.innerText = "𝤺";
    move_b.setAttribute('onclick', `setShipment(this, 'visible')`)
    name_p.innerText = file_name;
    volume_b.innerText = ">";
    volume_b.setAttribute('onclick', `scoochTrack(this, 1)`)
    volume_ba.innerText = "<";
    volume_ba.setAttribute('onclick', `scoochTrack(this, -1)`)
    playpause_b.innerText = "⯈";
    playpause_b.setAttribute('onclick', `toggleAudio(this)`);
    seeker_i.setAttribute('type', 'range');
    seeker_i.setAttribute('max', '100');
    seeker_i.setAttribute('value', '0');
    duration_p.innerText = "0:00";
    

    move_b.classList.add('move');
    name_p.classList.add('name');
    volume_d.classList.add('volume');
    playpause_b.classList.add('playpause');
    seeker_i.classList.add('seeker');
    duration_p.classList.add('duration');

    // "volume"
    volume_d.appendChild(volume_b);
    volume_d.appendChild(volume_ba);

    // special for shipment menu

    let shipment_d = document.createElement('div');
    let dests = Object.keys(audio_tree);
    
    dests.forEach(d => {
        let dest_e = document.createElement('button');
        dest_e.innerText = d;
        dest_e.setAttribute('onclick', `shipTrack(this)`);

        shipment_d.appendChild(dest_e)
    })

    shipment_d.setAttribute('onmouseleave', `setShipment(this, 'hidden')`);
    shipment_d.classList.add('shipment');


    //i hate this



    // Finally appened children
    track_div.appendChild(audio_e);
    track_div.appendChild(move_b);
    track_div.appendChild(name_p);
    track_div.appendChild(volume_d);
    track_div.appendChild(playpause_b);
    track_div.appendChild(seeker_i);
    track_div.appendChild(duration_p);
    track_div.appendChild(shipment_d);

    track_div.id = src.replaceAll('/','').replaceAll(' ','').replaceAll('.', '');
    console.log(track_div.id)

    //track_div.setAttribute('onclick', `toggleAudio(this.querySelector('.playpause'))`);

    // Get page, get array of all stacks, select stack with stack_index, append track
    document.getElementById(page_id).querySelectorAll('.stack')[stack_index].appendChild(track_div);
}


// Misc

function waveToast(title, message, type='error') {
    Toast.querySelector('h1').innerHTML = title;
    Toast.querySelector('p').innerHTML = message;
    Toast.classList.remove('error', 'success', 'meh');
    Toast.classList.add(type);


    // black magic that makes the animation restart when function is ran multiple times
    Toast.style.animation = 'none';
    Toast.offsetHeight;
    Toast.style.animation = null;

    Toast.style.animationName = 'left-alert';
    Toast.onanimationend = () => { Toast.style.animationName = ''; };
    
}