cc.Class {
    extends: cc.Component,
    properties: {
        bgmVolume: 1.0,
        sfxVolume: 1.0,
        bgmAudioID: -1,
    },

    init: () ->
        t = cc.sys.localStorage.getItem "bgmVolume"
        if t isnt null
            this.bgmVolume = parseFloat t
        t = cc.sys.localStorage.getItem "sfxVolume"
        if t isnt null
            this.sfxVolume = parseFloat t
        cc.game.on cc.game.EVENT_HIDE, () ->
            cc.log "cc.audioEngine.pauseAll"
            cc.audioEngine.pauseAll
        cc.game.on cc.game.EVENT_SHOW, () ->
            cc.log "cc.audioEngine.resumeAll"
            cc.audioEngine.resumeAll
    getUrl: (url) ->
        return cc.url.raw "resources/sounds/" + url
    playBGM: (url) ->
        audioUrl = this.getUrl url
        cc.log audioUrl
        if this.bgmAudioID >= 0
            cc.audioEngine.stop this.bgmAudioID
        this.bgmAudioID = cc.audioEngine.play audioUrl, true, this.bgmVolume
    playSFX: (url) ->
        audioUrl = this.getUrl(url)
        if this.sfxVolume > 0
            cc.audioEngine.play audioUrl, false, this.sfxVolume
    setSFXVolume: (v) ->
        if this.sfxVolume isnt v
            cc.sys.localStorage.setItem "sfxVolume", v
            this.sfxVolume = v
    setBGMVolume: (v, force) ->
        if this.bgmAudioID >= 0
            if v > 0
                cc.audioEngine.resume this.bgmAudioID
            else
                cc.audioEngine.pause this.bgmAudioID
        if this.bgmVolume isnt v or force
            cc.sys.localStorage.setItem "bgmVolume", v
            this.bgmVolume = v
            cc.audioEngine.setVolume this.bgmAudioID, v
}