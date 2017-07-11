cc.Class({
    extends: cc.Component,
    properties: {
        bgmVolume: 1.0,
        sfxVolume: 1.0,
        bgmAudioID: -1,
    },

    init:function()
    {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if(t !== null)
            this.bgmVolume = parseFloat(t);
        t = cc.sys.localStorage.getItem("sfxVolume");
        if(t !== null)
            this.sfxVolume = parseFloat(t);
        cc.game.on(cc.game.EVENT_HIDE, function()
        {
            cc.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });

        cc.game.on(cc.game.EVENT_SHOW,function()
        {
            cc.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll()
        })

    },
    getUrl:function(url)
    {
        return cc.url.raw("resources/sounds/" + url);

    },
    playBGM:function(url)
    {
        var audioUrl = this.getUrl(url);
        cc.log(audioUrl);
        if(this.bgmAudioID >= 0)
            cc.audioEngine.stop(this.bgmAudioID)
        this.bgmAudioID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
    }, 
    playSFX:function(url)
    {
        var audioUrl = this.getUrl(url)
        if(this.sfxVolume > 0)
            cc.audioEngine.play(audioUrl, false, this.sfxVolume);
    },
    setSFXVolume:function(v)
    {
        if(this.sfxVolume !== v)
        {
            cc.sys.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v
        }

    },
    setBGMVolume:function(v, force)
    {
        if(this.bgmAudioID >= 0)
            if (v > 0)
                cc.audioEngine.resume(this.bgmAudioID);
            else
                cc.audioEngine.pause(this.bgmAudioID);
        if(this.bgmVolume !== v || force)
        {
            cc.sys.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v
            cc.audioEngine.setVolume(this.bgmAudioID, v);
        }

    }

});