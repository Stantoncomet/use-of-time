/**
 * idk man just playing around with ways to simplify creating html with js
 * (because i dont wanna use node)
 * v0.1, from blog
 */

class DocEle {
    constructor (tag) {
        this.doc = document; // used to be a constructor arg, but idk
        this.ele = this.doc.createElement(tag);
    }
    addClass(...values) {
        this.ele.classList.add(...values);
    }
    setId(id) {
        this.ele.id = id;
    }
    setText(text) {
        this.ele.innerText = text;
    }
    setHTML(HTML) {
        this.ele.innerHTML = HTML;
    }
    appendChild(ele) {
        this.ele.appendChild(ele)
    }
    /**
     * sexiest function right here,
     * it's just so hot
     */
    appendToId(ele_id) {
        this.doc.getElementById(ele_id).appendChild(this.ele);
    }
    newChild(tag, innerHTML='') {
        let Child = new DocEle(tag);
        Child.setHTML(innerHTML);
        this.appendChild(Child.ele);
    }
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDate(epoch) {
    let ref = new Date(epoch);
    let year = ref.getFullYear();
    let month = MONTHS[ref.getMonth()];
    let day = ref.getDate();

    return `${month} ${day}, ${year}`;
}

function showEle(id) {
    document.getElementById(id).style.visibility = 'visible';
    document.getElementById(id).style.display = 'block';
}
function hideEle(id) {
    document.getElementById(id).style.visibility = 'hidden';
    document.getElementById(id).style.display = 'none';
}

/**
 * Returns the value of an element gotten by id
 * @param {string} id Element id
 * @returns
 */
function valOfId(id) {
    return document.getElementById(id).value;
}

function eleOfId(id) {
  return document.getElementById(id)
}
