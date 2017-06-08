URL = "http://localhost:9000"
cc.VERSION = "20161227"

HTTP = cc.Class {
    extends: cc.Component,
    statics: {
        sessionId: 0,
        userId: 0,
        master_url: URL,
        url: URL,
        sendRequest: (path, data, handler, extraUrl = null) ->
            xhr = cc.loader.getXMLHttpRequest()
            xhr.timeout = 5000
            str = "?"
            if data
                cc.log "data :" + JSON.stringify data
                for key, value of data
                    if str isnt '?'
                        str += "&"
                    str += key + "=" + value
            if extraUrl is null
                extraUrl = HTTP.url
            requestURL = extraUrl + path + encodeURI(str)
            cc.log "extraUrl :" + extraUrl
            cc.log "cc.URL:" + URL
            cc.log "RequestURL:" + requestURL
            xhr.open "GET", requestURL, true
            if cc.sys.isNative
                xhr.setRequestHeader "Accept-Encoding",
                    "gzip,deflate",
                    "text/html;charset=UTF-8"
            xhr.onreadystatechange = () ->
                if xhr.readyState is 4 and
                (xhr.status >= 200 and xhr.status < 300)
                    # cc.log "http res(" + xhr.responseText.length + "):" +
                    xhr.responseText
                    try
                        ret = JSON.parse xhr.responseText
                        # cc.log 'ret .....', ret
                        if handler isnt null
                            handler ret
                    catch e
                        cc.log "err:" + e
                    finally
                        # if cc.vv and cc.vv.wc
                            # cc.vv.wc.hide()
            # if cc.vv and cc.vv.wc
            #     cc.vv.wc.show()
            xhr.send()
            return xhr
    }
}