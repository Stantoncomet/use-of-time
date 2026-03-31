




// cnavs drawing stuff

/**
 * @type {HTMLCanvasElement}
 */
let canvas = document.getElementById('plot');
let ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PLOT_LEFT = 50;
const PLOT_LENGTH = WIDTH - 300;

let poi = 0;

let points = []

// reset points and draw blank plot
function clearPlot() {
    // background
    ctx.fillStyle = 'beige';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // line
    ctx.fillStyle = 'gray';
    ctx.fillRect(PLOT_LEFT, HEIGHT / 2, PLOT_LENGTH, 2);

    // 0-1
    ctx.font = '12px Arial';
    let subdivs = 10;
    for (let i = 0; i < subdivs + 1; i++) {
        let div_offset = i * PLOT_LENGTH / subdivs;
        ctx.fillRect(PLOT_LEFT + div_offset, HEIGHT / 2, 2, 10);

        ctx.fillText(i / 10, (PLOT_LEFT - 2) + div_offset, HEIGHT / 2 + 30);
    }

}

function plotPoint(x, over = true) {
    // map x (0..1) to px (0..PLOT_LENGTH)
    let px = x * PLOT_LENGTH;

    // point radius
    let r = 5;

    // stupid circle drawing
    ctx.fillStyle = 'teal';
    if (!over)
        ctx.fillStyle = 'orange';

    ctx.beginPath();
    ctx.ellipse(51 + px, HEIGHT / 2, r, r, Math.PI / 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();

    // add to array
    points.push(x);
}

function plotThreshold(x) {
    // map x (0..1) to px (0..PLOT_LENGTH)
    let px = x * PLOT_LENGTH;

    // line
    ctx.fillStyle = 'mediumseagreen';
    ctx.fillRect(PLOT_LEFT + px, HEIGHT / 2 - 20, 3, 40);

    // number
    ctx.font = '12px Arial';
    ctx.fillText(`${x.toFixed(3)}`, PLOT_LEFT + px - 14, HEIGHT / 2 - 25);
}

function plotRatio(num, den) {
    ctx.font = '20px Arial';

    // fraction numbers
    ctx.fillStyle = 'teal';
    ctx.fillText(`${num}`, WIDTH - 180, 80);
    ctx.fillStyle = 'orange';
    ctx.fillText(`${den}`, WIDTH - 180, 120);

    // dividing lines
    ctx.fillStyle = 'mediumseagreen';
    ctx.fillRect(WIDTH - 190, HEIGHT / 2 - 10, 70, 3);

    // quotient
    let est = (num / den).toFixed(5);
    ctx.fillText(`= ${est}`, WIDTH - 100, 100);
}




// actual math stuff

// estimate

function estimate(n, point_count) {
    // clear canvas
    clearPlot();

    // check each random against this, aka threshold ig
    poi = 1 / (n + 1);
    //poi = 1 / n

    let under_count = 0;
    let over_count = 0;
    for (let i = 0; i < point_count; i++) {
        let p = Math.random(); // random point

        // checks
        if (p < poi) {
            under_count++;
            plotPoint(p, false); // display to page
        } else {
            over_count++;
            plotPoint(p, true);
        }
    }
    plotThreshold(poi); // display threshold last

    let est = over_count / under_count;
    //let est = point_count / under_count;

    plotRatio(over_count, under_count);

    est = est.toFixed(5);

    return est;
}


// called from html form
function generateEstimation() {
    let n = document.getElementById('target').value;
    let count = document.getElementById('point_count').value;


    let est = estimate(Number(n), Number(count));


    document.getElementById('estimate').innerHTML = est;
}




// hover points
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    points.forEach(p => {
        let px = p * PLOT_LENGTH + 51;
        if ((y > HEIGHT / 2 - 5 && y < HEIGHT / 2 + 5) &&
            (x > px - 2.5 && x < px + 2.5)) {

            console.log(p);

            // clear old text
            ctx.fillStyle = 'beige';
            ctx.fillRect(PLOT_LEFT-20, HEIGHT/2-20, PLOT_LENGTH+40, 10);

            // display point
            ctx.font = '10px Arial';
            ctx.fillStyle = 'mediumseagreen';
            ctx.fillText(`${p.toFixed(3)}`, px-14, HEIGHT / 2 - 10);

            // redraw threshold line
            let tx = poi * PLOT_LENGTH;
            ctx.fillRect(PLOT_LEFT + tx, HEIGHT / 2 - 20, 3, 20);
        }
    })
});



window.onload = () => {
    clearPlot();
}