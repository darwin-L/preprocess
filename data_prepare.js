const fs = require('fs')

const data = fs.readFileSync('data/20160705.txt').toString().split(/\r?\n/)
const location = fs.readFileSync('data/location').toString().split(/\r?\n/)

const unitSet = new Set()
const unitSet2 = new Set()
function prepareData() {

    const locationSet = new Set()

    Array('台', "感", "審", "侵", "勞", "少", "仲", "原", "家", "軍", "毒", "緝", '臺', '更', '抗', "覆", "職", "非", "附", "基").forEach(element => {
        unitSet.add(element)
    })
    Array("急搜", "少連", "撤緩", "保險", "交易", "附民", "再審", "裁正", "海商", "財專", "國貿", "勞安", "訴願", "移調").forEach(ele => {
        unitSet.add(ele)
        unitSet2.add(ele)
    })
    
    // 目前地名set與unitSet沒有完全能重組的字元
    location.forEach(ele => {
        unitSet.add(ele)
        locationSet.add(ele)
    })
    
    const arr = []
    
    for (let i = 0; i < data.length; i++) {
        if (data[i].length == 1) {
            arr.push(data[i])
            unitSet.add(data[i])
            continue
        }
    }
    
    const numberFilter = new Set()
    Array("一", "二", "三", "四", "五", "六", "七","八","九").forEach(ele => numberFilter.add(ele))
    const result = new Set()
    const unsureSet = new Set()
    for (let i = 0; i < data.length; i++) {
        const len = data[i].length
        curr_arr_dp = new Array(len).fill(false)
        curr_arr_dp[0] = true
        for (let outerIdx = 1; outerIdx <= len; outerIdx++) {
    
            for (let InnerIdx = outerIdx - 1; InnerIdx >= 0; InnerIdx--) {
                if (curr_arr_dp[InnerIdx]) {
                    const splitWord = data[i].substring(InnerIdx, outerIdx)
    
                    if (unitSet.has(splitWord)) {
                        curr_arr_dp[outerIdx] = true
                        break
                    }
                }
            }
        }
        // prepare to insert
        if (curr_arr_dp[len]) {
            result.add(data[i])
        } else {
            // TODO: 剩餘270左右的不確定如何收束的貫字
            if (data[i].indexOf("(") < 0 && !numberFilter.has(data[i][data[i].length - 1])) {
                unsureSet.add(data[i])
            }
        }
    }
    const cleanData = Array.from(result)
    return cleanData
}

module.exports = {
    prepareData: prepareData,
    unitSet: unitSet,
    unitSet2: unitSet2
}
