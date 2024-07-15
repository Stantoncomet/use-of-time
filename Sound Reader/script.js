let parent_folder = 'audio';
let tracks = {};

let directoryHandle;
let fileEntries;


async function chooseDir() {
    directoryHandle = await window.showDirectoryPicker();
    parent_folder = directoryHandle.name;
    //console.log(tracks);
    loadAudio();
}

async function loadAudio() {
    if (!directoryHandle) return;
    document.getElementById('library').innerHTML = ""; // Clears old audio tracks
    await getTracks();
    console.log(tracks);
    

    
    

    // Populate library with divs
    // loop over folders, create shelf for each dir
    for (dir of Object.keys(tracks)) {
        let shelf = document.createElement('div');
        shelf.classList.add('shelf');
        shelf.id = `${dir}-shelf`;
        
        // loop over tracks
        for (file of tracks[dir]) {
            let track = document.createElement('button');
            let title = document.createElement('p');
            let id = document.createElement('p');
            
            //let audio_div = document.createElement('div');
            let audio = document.createElement('audio');
            let pin_btn = document.createElement('button');
            // add classes
            track.classList.add(dir);
            track.classList.add('track', 'full-track');
            
            track.tabindex = "-1";
            //audio_div.classList.add('audio-div');
            // pin button
            pin_btn.classList.add('pin-btn');
            pin_btn.innerText = "☆";//📌
            
            id.classList.add('id');
            
            let div_title = file.slice(0, -4); // remove file extension :p
            //div_title = div_title.slice(0,6); // limit title character count to 6
            //div_title += "...";
            title.innerText = `${div_title}`; // div title
            id.innerText = `${div_title}`;
            id.style.visibility = 'hidden';
            id.style.height = '0px';
            audio.controls = true; // play, seek, etc buttons
            audio.src = `${parent_folder}/${dir}/${file}` // audio source
            
            // add stuff
            track.appendChild(title);
            track.appendChild(id);
            //audio_div.appendChild(audio);
            //audio_div.appendChild(pin_btn);
            //track.appendChild(audio_div);
            track.appendChild(audio);
            track.appendChild(pin_btn);
            
            
            pin_btn.addEventListener('click', e => {
                let p_track = track.cloneNode(true);
                let p_pin_btn = p_track.querySelector('.pin-btn');
                
                // Change pin btn icon
                p_pin_btn.innerText = "★";
                
                //Pin button now unpins track
                p_pin_btn.addEventListener('click', e => {
                    p_pin_btn.parentNode.parentNode.removeChild(p_pin_btn.parentNode);
                })
                
                //Add track to pin list
                document.getElementById('pins').appendChild(p_track);
            })

            shelf.appendChild(track);
        }
        document.getElementById('library').appendChild(shelf);
    }
}

async function getTracks() {
    // Reset tracks to erase fragments
    tracks = {};
    fileEntries = await directoryHandle.values();
    for await (const fileEntry of fileEntries) {
        //make sure we only look at folders not starting with 'hid-'
        if (fileEntry.kind === 'directory' && !fileEntry.name.startsWith("hid-")) {
            tracks[fileEntry.name] = [];
            //add track names to tracks object
            for await (const subFileEntry of fileEntry.values()) {
                if (subFileEntry.kind === 'file') {
                    tracks[fileEntry.name].push(subFileEntry.name);
                }
            }
        }
    }
}





function switchTheme() {

    // loop over every track to switch themes
    document.querySelectorAll('.track').forEach(track_element => {
    
        //if it's a button-track:
        if (track_element.classList.contains('btn-track')) {
        
            //switch classes
            track_element.classList.remove('btn-track');
            track_element.classList.add('full-track');
            
            //title
            track_element.querySelector('p').innerText = track_element.querySelector('.id').innerHTML;
            //console.log(track_element.querySelector('.id').innerHTML);
            
            //pin button
            track_element.querySelector('.pin-btn').style.visibility = 'visible';
            
            //theme button, audio controls, and eventlister
            document.getElementById('theme-btn').textContent = "☷";
            track_element.querySelector('audio').controls = true;
            //track_element.removeEventListener('click', handleClick(track_element));
            track_element.onclick = function() {};
            //track_element.classList.add('gold'); //indicate full-tracks can be clicked anywhere to play
            //don't reset on finish
            track_element.querySelector('audio').ontimeupdate = function() {};

        } else {
        
            //switch classes
            track_element.classList.remove('full-track');
            track_element.classList.add('btn-track');
            
            //title
            track_element.querySelector('p').innerText = track_element.querySelector('p').innerText.slice(0,6); // limit title character count to 6
            track_element.querySelector('p').innerText += "...";
            
            //pin button
            track_element.querySelector('.pin-btn').style.visibility = 'hidden';
        
            //theme button, audio controls, and eventlister
            document.getElementById('theme-btn').textContent = "☰";
            track_element.querySelector('audio').removeAttribute('controls');
            //track_element.addEventListener('click', handleClick(track_element));
            track_element.onclick = function() { playTrack(track_element.querySelector('audio')); };
            //track_element.classList.remove('gold');
            
            //reset on finish
            track_element.querySelector('audio').ontimeupdate = function() { checkReset(track_element.querySelector('audio')); };
        }
    })
}

function info() {
    if (document.getElementById('info-window').style.visibility == 'visible') {
        document.getElementById('info-window').style.visibility = 'hidden';
        document.querySelectorAll('audio').forEach(audio => audio.style.visibility = 'visible');
    } else {
        document.getElementById('info-window').style.visibility = 'visible';
        document.querySelectorAll('audio').forEach(audio => audio.style.visibility = 'hidden');
    }
}

function zeroTracks() {
    document.querySelectorAll('audio').forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
}

function playTrack(audio_track) {
    console.log(audio_track);
    
    // If quick track, just reset and play again on press
    // If longer, clicking while playing stops
    if (audio_track.duration < 4) {
        audio_track.currentTime = 0;
        audio_track.play();
        audio_track.parentNode.classList.add('gold');
    } else {
        if (audio_track.currentTime == 0) {
            audio_track.play();
            audio_track.parentNode.classList.add('gold');
        } else {
            audio_track.pause();
            audio_track.currentTime = 0;
            audio_track.parentNode.classList.remove('gold');
        }
    }

    
    
    //Old method
    
    /*if (audio_track.currentTime == 0) {
        audio_track.play();
        audio_track.parentNode.classList.add('gold');
    } else {
        audio_track.pause();
        audio_track.currentTime = 0;
        audio_track.parentNode.classList.remove('gold');
    }*/
}

function checkReset(audio_track) {
    //console.log(audio_track.duration);
    //console.log(audio_track.currentTime);
    if (audio_track.duration <= audio_track.currentTime) {
        audio_track.pause();
        audio_track.currentTime = 0;
        audio_track.parentNode.classList.remove('gold');
    }
    //if (audio_track.currentTime)
}

document.addEventListener('keypress', e => {
    if (e.code == 'KeyT') {
        switchTheme();
    }
    if (e.code == 'KeyX') {
        zeroTracks();
    }
})
