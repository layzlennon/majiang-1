cc.Class {
    extends: cc.Component

    properties: {
        inputName: cc.EditBox,

    }
    onRandomBtnClicked: () ->
        names = [
            "上官",
            "欧阳",
            "东方",
            "端木",
            "独孤",
            "司马",
            "南宫",
            "夏侯",
            "诸葛",
            "皇甫",
            "长孙",
            "宇文",
            "轩辕",
            "东郭",
            "子车",
            "东阳",
            "子言",
        ]
        names2 = [
            "雀圣",
            "赌侠",
            "赌圣",
            "稳赢",
            "不输",
            "好运",
            "自摸",
            "有钱",
            "土豪",
        ]

        idx = Math.floor Math.random() * (names.length - 1)
        idx2 = Math.floor Math.random() * (names2.length - 1)
        this.inputName.string = names[idx] + names2[idx2]
    onLoad: () ->
        this.onRandomBtnClicked()
    onBtnConfirmClicked: () ->
        name = this.inputName.string
        if name is ""
            cc.log "invalid name"
        cc.log "name :" + name
        cc.vv.userMgr.createUser name
    update: (dt) ->
        # do your update here
}
