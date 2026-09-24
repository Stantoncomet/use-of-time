let post_pos = []

// WINDOW LOAD
window.onload = async () => {
  setInterval(updateLoop, 20);
  // check for new posts every 5 seconds
  setInterval(checkForNewPosts, 5000);

  // check status
  let online = await fetchStatus();
  if (online)
    document.getElementById('status').innerHTML = "Network is: online";
  else
    document.getElementById('status').innerHTML = "Network is: offline";

  // fetch all posts
  let posts = await fetchPosts().then(data => data.posts);

  // display posts
  posts.forEach((p, i) => {
    newPost(p.content, i)

  })


}

function updateLoop() {

  // drift posts
  post_pos.forEach((_, i) => {
    drift(eleOfId(i), i);
  })
}

function drift(e, idx) {
  if (post_pos[idx].y + post_pos[idx].h > document.body.clientHeight || post_pos[idx].y < 0)
    post_pos[idx].vy *= -1;
  if (post_pos[idx].x + post_pos[idx].w > document.body.clientWidth || post_pos[idx].x < 0)
    post_pos[idx].vx *= -1;

  post_pos[idx].x += post_pos[idx].vx;
  post_pos[idx].y += post_pos[idx].vy;
  e.style.left = post_pos[idx].x;
  e.style.top = post_pos[idx].y;
}

async function checkForNewPosts() {
  // fetch all posts
  let new_posts = await fetchPosts().then(data => data.posts);

  let new_post_count = new_posts.length;
  let cur_post_count = post_pos.length;

  if (new_post_count > cur_post_count) {
    for (let i = cur_post_count; i < new_post_count; i++) {
      newPost(new_posts[i].content, i)
    }
  }
}



// POST
async function post() {

  // get content
  let content = valOfId('content').trim()
  if (content == "") return;
  // check if it's already in the the post list
  let current_posts = []
  document.getElementById('board').querySelectorAll('p').forEach(p => {
    current_posts.push(p.innerHTML);
  })
  if (current_posts.indexOf(content) != -1) {
    window.location.reload();
    return;
  }

  // post to server
  await postPost({ timestamp: Date.now(), content: content });

  // update client
  newPost(content, post_pos.length);
  eleOfId('content').value = "";
}


function newPost(content, index) {
  post_ele = new DocEle('p');
  post_ele.setText(content);

  let r = Math.random() * 255;
  let g = Math.random() * 255;
  let b = Math.random() * 255;
  post_ele.ele.style.color = `rgb(${r}, ${g}, ${b})`;

  flashScreen(r*.2, g*.2, b*.2);

  post_ele.setId(index);
  post_pos.push({
    x: document.body.clientWidth/2,
    y: document.body.clientHeight/2,
    vx: Math.random() * 5 - 2.5,
    vy: Math.random() * 5 - 2.5,
    w: 0,
    h: 0
  })

  // update pos before add to doc
  post_ele.ele.style.left = post_pos[index].x;
  post_ele.ele.style.top = post_pos[index].y;


  post_ele.appendToId('board');

  // update size after rendered to screen?
  post_pos[index].w = post_ele.ele.clientWidth;
  post_pos[index].h = post_ele.ele.clientHeight;
}

function flashScreen(r, g, b) {
  if (r <= 0 && g <= 0 && b <= 0) return;
  eleOfId('board').style.backgroundImage = `radial-gradient(rgb(${r}, ${g}, ${b}), black)`;

  setTimeout(() => flashScreen(r-10, g-10, b-10), 100);
}
