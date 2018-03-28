// AudioEngine classes

////////////////////////////////////////////////////////////////

var AudioEngine = function() {
};

AudioEngine.prototype.init = function(cb) {
    this.volume = 0.6;
    this.sounds = {};
    return this;
};

AudioEngine.prototype.load = function(id, url, cb) {
};

AudioEngine.prototype.play = function() {
};

AudioEngine.prototype.stop = function() {
};

AudioEngine.prototype.setVolume = function(vol) {
    this.volume = vol;
};


AudioEngineWeb = function() {
    this.threshold = 1000;
    this.worker = new Worker("/workerTimer.js");
    var self = this;
    this.worker.onmessage = function(event)
    {
        if(event.data.args)
            if(event.data.args.action==0)
            {
                self.actualPlay(event.data.args.id, event.data.args.vol, event.data.args.time, event.data.args.part_id);
            }
            else
            {
                self.actualStop(event.data.args.id, event.data.args.time, event.data.args.part_id);
            }
    }
};

AudioEngineWeb.prototype = new AudioEngine();

AudioEngineWeb.prototype.init = function(cb) {
    AudioEngine.prototype.init.call(this);

    this.context = new AudioContext();

    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
    this.masterGain.gain.value = this.volume;

    this.limiterNode = this.context.createDynamicsCompressor();
    this.limiterNode.threshold.value = -10;
    this.limiterNode.knee.value = 0;
    this.limiterNode.ratio.value = 20;
    this.limiterNode.attack.value = 0;
    this.limiterNode.release.value = 0.1;
    this.limiterNode.connect(this.masterGain);

    // for synth mix
    this.pianoGain = this.context.createGain();
    this.pianoGain.gain.value = 0.5;
    this.pianoGain.connect(this.limiterNode);
    this.synthGain = this.context.createGain();
    this.synthGain.gain.value = 0.5;
    this.synthGain.connect(this.limiterNode);

    this.playings = {};

    if(cb) setTimeout(cb, 0);
    return this;
};

AudioEngineWeb.prototype.load = function(id, url, cb) {
    var audio = this;
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.responseType = "arraybuffer";
    req.addEventListener("readystatechange", function(evt) {
        if(req.readyState !== 4) return;
        try {
            audio.context.decodeAudioData(req.response, function(buffer) {
                audio.sounds[id] = buffer;
                if(cb) cb();
            });
        } catch(e) {
            /*throw new Error(e.message
                + " / id: " + id
                + " / url: " + url
                + " / status: " + req.status
                + " / ArrayBuffer: " + (req.response instanceof ArrayBuffer)
                + " / byteLength: " + (req.response && req.response.byteLength ? req.response.byteLength : "undefined"));*/
            new Notification({id: "audio-download-error", title: "Problem", text: "For some reason, an audio download failed with a status of " + req.status + ". ",
                target: "#piano", duration: 10000});
        }
    });
    req.send();
};

AudioEngineWeb.prototype.actualPlay = function(id, vol, time, part_id) { //the old play(), but with time insted of delay_ms.
    if(!this.sounds.hasOwnProperty(id)) return;
    var source = this.context.createBufferSource();
    source.buffer = this.sounds[id];
    var gain = this.context.createGain();
    gain.gain.value = vol;
    source.connect(gain);
    gain.connect(this.pianoGain);
    source.start(time);
    // Patch from ste-art remedies stuttering under heavy load
    if(this.playings[id]) {
        var playing = this.playings[id];
        playing.gain.gain.setValueAtTime(playing.gain.gain.value, time);
        playing.gain.gain.linearRampToValueAtTime(0.0, time + 0.2);
        playing.source.stop(time + 0.21);
        if(enableSynth && playing.voice) {
            playing.voice.stop(time);
        }
    }
    this.playings[id] = {"source": source, "gain": gain, "part_id": part_id};

    if(enableSynth) {
        this.playings[id].voice = new synthVoice(id, time);
    }
}

AudioEngineWeb.prototype.play = function(id, vol, delay_ms, part_id)
{
    if(!this.sounds.hasOwnProperty(id)) return;
    var time = this.context.currentTime + (delay_ms / 1000); //calculate time on getNote receive.
    var delay = delay_ms - this.threshold;
    if(delay<=0) this.actualPlay(id, vol, time, part_id);
    else {
        this.worker.postMessage({delay:delay,args:{action:0/*play*/,id:id, vol:vol, time:time, part_id:part_id}}); // but start scheduling right before play.
    }
}

AudioEngineWeb.prototype.actualStop = function(id, time, part_id) {
    if(this.playings.hasOwnProperty(id) && this.playings[id] && this.playings[id].part_id === part_id) {
        var gain = this.playings[id].gain.gain;
        gain.setValueAtTime(gain.value, time);
        gain.linearRampToValueAtTime(gain.value * 0.1, time + 0.16);
        gain.linearRampToValueAtTime(0.0, time + 0.4);
        this.playings[id].source.stop(time + 0.41);


        if(this.playings[id].voice) {
            this.playings[id].voice.stop(time);
        }

        this.playings[id] = null;
    }
};

AudioEngineWeb.prototype.stop = function(id, delay_ms, part_id) {
    var time = this.context.currentTime + (delay_ms / 1000);
    var delay = delay_ms - this.threshold;
    if(delay<=0) this.actualStop(id, time, part_id);
    else {
        this.worker.postMessage({delay:delay,args:{action:1/*stop*/, id:id, time:time, part_id:part_id}});
    }
};

AudioEngineWeb.prototype.setVolume = function(vol) {
    AudioEngine.prototype.setVolume.call(this, vol);
    this.masterGain.gain.value = this.volume;
};










