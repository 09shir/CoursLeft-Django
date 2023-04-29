import { splitYearTerm } from './termsPrediction'

const semester = ['Spring', 'Summer', 'Fall']

function getCurrentYear() {
    let date = new Date()
    console.log(date.getFullYear())
    return date.getFullYear()
}

function getCurrentMonth() {
    let date = new Date()
    return date.getMonth()
}

function getCurrentTerm() {
    let month = getCurrentMonth()
    if (month <= 4){
        return semester[0]
    }
    else if (month <= 8){
        return semester[1]
    }
    else{
        return semester[2]
    }
}

function getNextTerm(currentTerm){
    // input Spring 2024
    // output Summer 2024
    let cYear = splitYearTerm(currentTerm)[0]
    let cTerm = splitYearTerm(currentTerm)[1]

    let rYear = ''
    let rTerm = ''

    if (cTerm === semester[2]){rTerm = semester[0]; rYear = String(parseInt(cYear)+1)}
    else if (cTerm === semester[0]){rTerm = semester[1]; rYear = cYear}
    else {rTerm = semester[2]; rYear = cYear}

    let ret = rTerm + ' ' + rYear
    return ret
}

export {getCurrentYear, getCurrentMonth, getCurrentTerm, getNextTerm}