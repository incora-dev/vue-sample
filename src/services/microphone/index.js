const MICROPHONE_LEVEL_MIN = 25;
let audioContext = null;

/**
 * 
 * @param {boolean} isMicroEnabled 
 * @param {string} canvasId -- id of DOM - element
 * @param {function} callback -- show is volume more than minimum level
 */
export const showMicrophonePower = (isMicroEnabled, canvasId, callback) => {
    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

    if(!isMicroEnabled && audioContext){
      audioContext.close();
      audioContext = null;
      return;
    } 
    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio: true},
        (stream)=> {
          audioContext = audioContext || new AudioContext();
          let analyser = audioContext.createAnalyser();
          let microphone = audioContext.createMediaStreamSource(stream);
          let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
          
          analyser.smoothingTimeConstant = 0.8;
          analyser.fftSize = 1024;
          microphone.connect(analyser);
          analyser.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);
          
          let canvasContext = document.getElementById(canvasId).getContext("2d");
          
          javascriptNode.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;
            stream.getAudioTracks()[0].enabled = true;
            const length = array.length;
              for (let i = 0; i < length; i++) {
                values += (array[i]);
              }
            const average = values / length;
            if (average * 2 / 3 >= MICROPHONE_LEVEL_MIN ){
                if (callback) callback(true);
            } else {
               if (callback) callback(false);
            }

             const grd = canvasContext.createLinearGradient(0, 0, 170, 0);
             grd.addColorStop(0, "black");
             grd.addColorStop(0.4, "red");
             grd.addColorStop(0.6, "black");
             canvasContext.createLinearGradient(0, 0, 170, 0);
             canvasContext.clearRect(0, 0, 150, 300);
             canvasContext.fillStyle = 'white';
             canvasContext.fillRect(0,  average * 2 + 10, 170, 300);
             canvasContext.fillStyle = 'red';
          }
      },
      err => console.log("The following error occured: " + err.name));
    } else {
      console.log("getUserMedia not supported");
    }
 };
