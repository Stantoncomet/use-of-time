let game_folder = 'test_game';
let directory_handle;

let scene;
let scene_id_cur = '';

let feedback_ele;

document.addEventListener('DOMContentLoaded', e => {
    scene = document.getElementById('scene');
    feedback_ele = document.getElementById('feedback');

    loadScene('');
})

document.addEventListener('keypress', async e => {  
    // load the current scene's path, plus the user's input
    // if it's valid, celebrate! else reply with message
    if (await loadScene(scene_id_cur + e.key)) {
        console.log("Loaded next scene");
        feedback_ele.innerText = "Enter an option";
    } else {
        feedback_ele.innerText = `${e.key} is not a valid option`;
    }
})

/**
 * Opens a menu to select a game folder.
 */
async function chooseDir() {
    directory_handle = await window.showDirectoryPicker();
    game_folder = directory_handle.name;
    await loadGame();
    await loadScene('');
}

/**
 * Loads or reloads data from config file.
 */
async function loadGame() {
    const config_values = await fetch(`${game_folder}/config.txt`)
                                    .then(res => res.text())
                                    .catch(e => console.log(e));
    const scene_width = config_values.match(/(?<=scene-width:).*/g);
    const scene_height = config_values.match(/(?<=scene-height:).*/g);

    //scene.width = scene_width;
    scene.height = scene_height;
}

/**
 * Loads a scene from inputted path. If path is empty, start scene is loaded.
 * @param {string} scene_id Ex. "01102".
 * @returns Bool, if setting the scene source succeded.
 */
async function loadScene(scene_id) {
    let target_scene_path = '';
    for (page of scene_id) {
        target_scene_path += `/${page}`;
    }

    // Check if a jump file exists at that scene path
    const do_jump = await fetch(`${game_folder}${target_scene_path}/jump.txt`)
                                .then(res => {
                                    if (res.ok) { return res.text(); }
                                    else { return false; }
                                });
    if (do_jump) {
        let jump_id = do_jump.match(/(?<=scene:).*/g);
        if (!jump_id) jump_id = ''; // if match returns null, set to empty string
        console.log(jump_id);

        loadScene(jump_id);
    }

    // Check if a scene exists with that id
    const path_is_valid = await fetch(`${game_folder}${target_scene_path}/scene.png`)
                                .then(res => res.ok);

    //console.log(path_is_valid); // Used for testing

    if (path_is_valid) {
        scene.src = `${game_folder}${target_scene_path}/scene.png`;
        scene_id_cur = scene_id;
    }
    return path_is_valid;
}