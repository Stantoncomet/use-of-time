
const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('in', (event) => {
    const fileList = event.target.files;
    console.log(event.target.files[0].webkitRelativePath)
});
document.addEventListener('DOMContentLoaded', e => {
    console.log(fileInput.files)
})


