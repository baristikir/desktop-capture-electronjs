//Modules
const { desktopCapturer, remote } = require('electron');
const { dialog, Menu } = remote;
const { writeFile } = require('fs');

//Global state
let mediaRecorder;
const recordedChunks = [];

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

        videoSelectBtn.innerText = source.name;

        const constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id
                }
            }
        };

        //Create a Stream
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        //Preview the source in a video element
        videoElement.srcObject = stream;
        videoElement.play();

        //Create the Media Recorder
        const options = { mimeType: 'video/webm; codecs=vp9'};
        mediaRecorder = new MediaRecorder(stream, options);

        //Register Event Handlers
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleStop;

        //Update UI

    }

    //Captures all recorded chunks
    function handleDataAvailable(e) {
        console.log('video data available');
        recordedChunks.push(e.data);
    }

    //Saves the video file on stop
    async function handleStop(e) {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm; codecs=vp9'
        });

        const buffer = Buffer.from(await blob.arrayBuffer());

        const { filePath } = await dialog.showSaveDialog({
            buttonLabel: 'Save video',
            defaultPath: `vid-${Date.now()}.webm`
        });

        if(filePath) {
            writeFile(filePath, buffer, () => console.log('video saved successfully!'));
        }
    }



}