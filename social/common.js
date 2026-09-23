/***************************************************************************************************************/
/**
 * This common.js file contains the cool and awesome code for interfacing with the database.
 * Specifically adjusted for the social page. Base code from:
 * Demo v1.0
 */
/***************************************************************************************************************/

// Global vars
const DB_URL = (endpoint) => `https://stantoncomet.gleeze.com${endpoint}`;


/**
 * Check if database server is online
 * @returns true if database is online, false if something isnt working
 */
async function fetchStatus() {
    let data = await fetch(DB_URL('/api/social/ping'))
        .then(response => response.json())
        .catch(err => {console.log(err); return false})
    if (!data) // when nginx or the nodejs server is down, data == false
        return false;
    return true;
}


/**
 * Fetches the latest data from the posts file
 * @returns File contents in JSON format
 */
async function fetchPosts() {
    let data = await fetch(DB_URL(`/api/social/resources  `))
        .then(response => response.json())
        .catch(err => {console.log(err); return 1})
    return data;
}

/**
 * Posts post data to the file
 * @param {object} data JSON please :)
 * @returns
 */
async function postPost(data) {
    let success = await fetch(DB_URL(`/api/social/resources`), {
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: data
        })
    })
        .then(response => response.json())
        .catch(err => console.log(err))
    return success;
}
