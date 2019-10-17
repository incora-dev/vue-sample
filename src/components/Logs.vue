<template>
  <div class="logs">
    <h2>LOGS PAGE</h2>
    <div class="logs-head">
      <div class="logs-head-left">
        <textarea id="" cols="60" rows="10"></textarea>
      </div>
      <div class="logs-head-right">
        <div class="micro-section">
          <img v-if="mic_enabled" v-on:click.capture="toggleMic" class="logs-micro" src="static/green_micro.png" height="70"/>
          <img v-else v-on:click.capture="toggleMic" class="logs-micro" src="static/red_micro.png" height="70"/>
          <span>ON/OFF MIC</span>
        </div>
        <div>
          <canvas id="micro-volume-canvas2" class="micro-volume-canvas" width="150" height="300"></canvas>
          <span class="volume-span">Volume Meter</span>
        </div>
      </div>
    </div>
    <!-- TABLE section-->
    <div class="logs-bottom">
      <h6>log of your entries</h6>
      <table>
        <thead>
            <tr>
              <th>date</th>
              <th>text of entries</th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="entry of entries" :key="entry.first">
              <td>{{entry.date}}</td>
              <td>{{entry.text}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import {mapGetters} from 'vuex';
import axios from 'axios';
import io from 'socket.io-client';
import ss from 'socket.io-stream';
import SocketStream from 'socket-stream';
import { showMicrophonePower } from '../services/microphone';

  let recognition
    , recognizing = false
    , final_transcript = ''
    , ignore_onend = false
    , start_timestamp
    , audioRecording = {}
    , queuedAudioUploads = {}
    , socketStream;

  let wkRecognition,
      currentRecognitionTarget;

  const addScriptToDocument = (src, onload) => {
    let script = document.createElement('script');
    script.type = "text/javascript";
    script.src = src;
    if (onload) {
      script.onload = onload;
    }
    document.body.appendChild(script);
  };
export default {
    beforeCreate() {
      addScriptToDocument('/static/js/audioRecord.js');
    },
    created() {
      socketStream = new SocketStream(io, ss, process.env.SPEECH_SOCKET_IO_SERVER);
      if (socketStream) {
        socketStream.socket.on('google-message', this.parseResponse)
      }
    },
    methods: {
      sendLogs(log_message) {
        if(!log_message) return;

        axios.post(`${process.env.API_LOCATION}/logs`,{
          user_id: this.tokenData.user_id,
          message: log_message,
        })
        .then(() => {
          this.entries.unshift({
             date: moment().format('LLLL'),
            text: log_message
          });
        });
      },
    toggleMic() {
        if (!this.mic_enabled) {
          this.mic_enabled = true;
          this.recording = false;
          setTimeout(() => { // turn off micro after 5s
            this.toggleMic();
          }, 5000)
          socketStream.startStreaming('google', '');

          showMicrophonePower( true, 'micro-volume-canvas2' );
          if(this.mic_enabled) this.startRecording();
          if(!socketStream.deviceRequested){
            socketStream.requestDevice();
          } else if(socketStream.deviceRequested && socketStream.context.state == 'closed'){
            socketStream.deviceRequested = false;
            delete window.audio_context;
            socketStream.requestDevice();
          }
        } else {
          this.mic_enabled = false;
          socketStream.stopStreaming();
          showMicrophonePower(false, 'micro-volume-canvas2');
          if(socketStream){
            socketStream.context.close();
          }
        }
      },
      startRecording(event, target) {
        if(socketStream && socketStream.context && socketStream.context.state === 'suspended'){
          socketStream.context.resume();
        }
      },
      stopRecording(event, target, stages) {

        if (this.mic_enabled && this.recording) {

          if(!window.hasOwnProperty('audio_context')){
            window.audio_context.context.close();
            this.recording = false;
          }

          if(!this.isCapable){
            socketStream.stopStreaming();
            this.recording = false;
          }
        }
      },
      parseResponse(data){
        const {transcription, target} = data;
        this.sendLogs(transcription);
      },

    loadLogs(id){
      axios.get(`${process.env.API_LOCATION}/logs/${id}`)
      .then(response=>{
        this.entries = response.data[0].data.map(log=>{
          return {
            date: moment(log.created_at).format('LLLL'),
            text: log.text_of_entry
          }
        });
      });
    }
  },
    computed:{
    ...mapGetters('auth', ['tokenData']),
  },
  mounted(){
    this.loadLogs(this.tokenData.user_id);
  },
  data() {
    return {
      mic_enabled: false,
      audioContext: null,
      entries: [{
        date: moment().format('LLLL'),
        text: '123123'
      }]
    }
  }
}
</script>

<style scoped>
img{
  user-select: none;
  cursor: pointer;
}
  h6, th{
    text-transform: uppercase;
  }
  .logs{
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .logs-head{
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
  .logs-head-left{
    width: 50%;
    margin: 10px 0;
    display: flex;
    justify-content: center;
  }
  .logs-head-right{
    display: flex;
    width: 50%;
    justify-content: center;
  }
  .logs-head textarea{
    border-radius: 16px;
    overflow: hidden;
    text-indent: 10px;
    padding: 5px;
    border: 1px solid;
    outline: none;
  }
  .micro-section{
    display: flex;
    flex-direction: column;
    margin-right: 45px;
    align-items: center;
  }
  span.volume-span{
    position: relative;
    right: 26px;
    bottom: 32px;
  }
  .logs-head-right canvas.micro-volume-canvas {
    top: -15px;
    left: 40px;
  }

  table, thead, tr, td, th{
    display: flex;
    justify-content: center;
    width: 100%;
  }
  table{
    flex-direction: column;
  }
  td, th{
    padding: 10px;
    border:1px solid grey;
    border-left: none;
    border-top: none;
  }
  table thead th:first-child{
    border-left: none;
  }
  th:last-child{
    border-right: none;
  }
  tr th:first-child, tr td:first-child{
    width: 25%;
    border-left: 1px solid grey;
  }
  thead{
    border-radius: 20px 20px 0 0;
    border: 1px solid grey;
    border-bottom: none;
    color: grey;
    overflow: hidden;
  }
    .micro{
    position: relative;
    display: flex;
    width: 160px;
    justify-content: center;
    height: 35px;
    cursor: pointer;
  }
  #micro-volume-canvas1 {
    top: -32px;
  }
  .micro-volume-canvas{
    width: 20px;
    height: 100px;
    margin: 0 10px;
    position: relative;
    transform: rotateZ(90deg);
    border-radius: 3px;
    background-position-y: -15px;
    background-image: url('data:image/png;base64,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');
  }
  .micro img{
    position: relative;
    left: 40px;
  }
</style>

