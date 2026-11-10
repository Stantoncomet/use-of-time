
let RESPONSE_TIME = 30

let blocked_usernames = []

async function loadDiscussion(disc_id, acting_user) {
    hideEle('discussions')
    showEle('current-discussion')
    // clear old posts
    document.querySelectorAll('#current-discussion .fpost').forEach(e => {
        e.remove()
    })
    document.querySelectorAll('.pls-clear').forEach(e => {
        e.remove()
    })
    blocked_usernames = []

    // load json using disc_id
    let dialog = await fetch('./discussions/' + disc_id + '.json')
        .then(res => res.json())

    let usernames = {}
    let show_delay = 0

    let topic_note = `<b>Topic</b> seems to be missing :(`

    // loop thru json dialog and timeout() based on length + randomness
    for (const d of dialog) {
        let uid = String(d[0])
        let msg = d[1]
        // break if -1 (end)
        if (uid == -1) {
            topic_note = msg
            break
        }
        // if user id not in usernames, generated new one and add
        console.log(Object.keys(usernames), uid, usernames)
        if (!Object.keys(usernames).includes(uid) || uid == acting_user) {
            // if user id is acting_user, using "you" as username and promt user
            if (uid == acting_user) {
                usernames[uid] = "You"

                // new response
                let resBtn = new DocEle('button')
                resBtn.setId('prompt')
                resBtn.setHTML('Respond')
                resBtn.appendToId('current-discussion')
                await promptUser()
                // delete id from response button
                resBtn.setId()
                resBtn.addClass('pls-clear')
                resBtn.setHTML('Response:')

                show_delay = 0
            } else {
                usernames[uid] = randomItem(names)
                show_delay = msg.length * RESPONSE_TIME
            }
        } else {
            show_delay = msg.length * RESPONSE_TIME
        }

        // redacted blocked users' messages
        if (blocked_usernames.includes(usernames[uid])) {
            msg = "<i>You have blocked this user</i>"
        }
        

        if (msg.startsWith("{")) {
            msg = "[@" + usernames[msg[1]] + "] " + msg.slice(3)
        }

        await sleep(show_delay)
        makeFPost(usernames[uid], msg)
        // makeFPost()
    }

    let endTopic = new DocEle('p')
    endTopic.addClass('fpost', 'topic-box')
    endTopic.setHTML(topic_note)
    endTopic.appendToId('current-discussion')
}

function unloadDiscussion() {
    hideEle('current-discussion')
    showEle('discussions')
}

async function promptUser() {
    return new Promise(resolve => document.getElementById('prompt').addEventListener('click', resolve))
}

function blockUsername(username) {
    blocked_usernames.push(username)
}