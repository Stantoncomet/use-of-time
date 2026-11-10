let users = {
    "You": "you-pfp.jpg"
}

function getPfp(user) {
    let pfp = users[user]
    if (pfp == undefined)
        return "assets/pfp.jpg"
    else
        return "assets/"+pfp
}


function makeFPost(username, content="", load_discussion="") {
    let post = new DocEle('div')
    post.addClass('fpost')

    

    // is title for discussion?
    if (load_discussion != "")
        post.ele.onclick = `loadDiscussion(${load_discussion})`

    // metadata is pfp, username, timestamp
    let metadata = new DocEle('div')
    // profile picture
    let pfp = new DocEle('img')
    pfp.ele.src = getPfp(username)
    metadata.appendChild(pfp.ele)
    // username
    metadata.newChild('p', username)
    // timestamp
    metadata.newChild('p', formatDate(Date.now()))

    post.appendChild(metadata.ele)

    // main body text
    post.newChild('p', content)

    // block button
    let block_btn = new DocEle('button')
    block_btn.setHTML('block')
    block_btn.ele.onclick = `blockUsername(${username})`
    post.appendChild(block_btn.ele)

    // add to document/discussion
    post.appendToId('current-discussion')

}

function makeSPost(username, img_src="", header="", caption="") {
    let post = new DocEle('div')
    post.addClass('spost')

    // content for social post is img or text
    if (img_src != "") {
        let content = new DocEle('img')
        content.ele.src = img_src
        post.appendChild(content.ele)
    } else {
        post.newChild('h1', header)
    }

    // metadata is pfp, username, timestamp
    let metadata = new DocEle('div')
    // profile picture
    let pfp = new DocEle('img')
    pfp.ele.src = getPfp(username)
    metadata.appendChild(pfp.ele)
    // username
    metadata.newChild('p', username)
    // timestamp
    metadata.newChild('p', formatDate(Date.now()))

    post.appendChild(metadata.ele)

    // caption
    post.newChild('p', caption)
    // buttons
    post.newChild('button', "♡")
    post.newChild('button', "⚐")

    // add to document/feed
    post.appendToId('feed')

}


let nms = `SavageStar
LuckyMoon
StoneRaven
TinyOrc
NinjaHawk
NeonMedic
FrostShark
LightStorm
FoundTroll
TurboNebula
Golden_Support
Thunder_Owl
Happy_Planet
Mute_Dolphin
Iron_Pro
Sneaky_Viper
Ninja_Scorpion
Brave_Snow
Awake_Medic
Fierce_Sword
Flying_Hawk_5153
Quick_Witch_232
Star_Wolf_946
Falling_Light_3444
Clever_Eagle_260
Cool_Flame_3608
Mega_Fire_3798
Running_Raven_26
Joking_Brawler_928
Lost_Warrior_81
GiantDwarf4805
StonePro5384
IdlePrincess693
SadAssassin2859
TinyKing775
RunningSword55
CosmicWolf46
CyberOrc50
AmusedIce300
IdleAlien78`

let names = nms.split('\n')

function randomItem(in_array) {
    return in_array[Math.floor(Math.random()*in_array.length)]
}

function sleep(seconds) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds);
   });
}