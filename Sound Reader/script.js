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
    for (dir of Object.keys(tracks)) {
        let shelf = document.createElement('div');
        shelf.classList.add('shelf');
        shelf.id = `${dir}-shelf`;
        for (file of tracks[dir]) {
            let track = document.createElement('div');
            let title = document.createElement('p');
            let audio = document.createElement('audio');
            track.classList.add(dir);
            track.classList.add('track', 'full-track');
            title.innerText = `${file}`;
            audio.controls = true;
            audio.src = `${parent_folder}/${dir}/${file}`
            track.appendChild(title);
            track.appendChild(audio);

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
        tracks[fileEntry.name] = [];
        if (fileEntry.kind == 'directory') {
            for await (const subFileEntry of fileEntry.values()) {
                if (subFileEntry.kind == 'file') {
                    tracks[fileEntry.name].push(subFileEntry.name);
                }
            }
        }
    }
}

function switchTheme() {
    if (document.getElementById('theme-btn').textContent == "☷") {
        document.getElementById('theme-btn').textContent = "☰";

        document.querySelectorAll('.track').forEach(track_element => {
            let new_track_element = document.createElement('button');
            new_track_element.innerHTML = track_element.innerHTML;
            for (const index in track_element.attributes) {
                new_track_element.setAttribute(track_element.attributes[index].name,
                    track_element.attributes[index].value);
            }

            new_track_element.classList.remove('full-track');
            new_track_element.classList.add('btn-track');
            new_track_element.querySelector('audio').removeAttribute('controls');
            new_track_element.onclick = (e => playTrack(new_track_element.querySelector('audio')));

            track_element.parentElement.replaceChild(new_track_element, track_element);
        })
    } else {
        document.getElementById('theme-btn').textContent = "☷";

        document.querySelectorAll('.track').forEach(track_element => {
            let new_track_element = document.createElement('div');
            new_track_element.innerHTML = track_element.innerHTML;
            for (const index in track_element.attributes) {
                new_track_element.setAttribute(track_element.attributes[index].name,
                    track_element.attributes[index].value);
            }

            new_track_element.classList.remove('btn-track');
            new_track_element.classList.add('full-track');
            new_track_element.querySelector('audio').controls = true;
            new_track_element.removeAttribute('onclick');

            track_element.parentElement.replaceChild(new_track_element, track_element);
        })
    }
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

function playTrack(audio_track) {
    console.log(audio_track);
    if (audio_track.currentTime == 0) {
        audio_track.play();
    } else {
        audio_track.pause();
        audio_track.currentTime = 0;
    }
    
    
}

//document.addEventListener('DOMContentLoaded', e => loadAudio())