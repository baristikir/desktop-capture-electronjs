//Modules
const { desktopCapturer, remote } = require('electron');
const { Menu } = remote;
//Buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

const videoSelectBtn = document.getElementById('videoSelectBtn');
//Trigger function on button event
videoSelectBtn.onclick = getVideoSources;


//Get available video sources
async function getVideoSources() {
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    //UI Element for select source
    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source =>{
            return {
                label: source.name,
                click: () => selectSource(source)
            };
        })
    );

    videoOptionsMenu.popup();

    //Change the Video Source window to record
    async function selectSource(source) {



    }



}