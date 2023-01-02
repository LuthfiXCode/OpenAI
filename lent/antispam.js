import { add } from './index';
console.log(add(1, 2));
const usedCommandRecently = new Set()
const isFiltered = (from) => {
    return !!usedCommandRecently.has(from)
}
const addFilter = (from) => {
    usedCommandRecently.add(from)
    setTimeout(() => {
        return usedCommandRecently.delete(from)
    }, 100000)
}
module.exports = {
    msgFilter: {
        isFiltered,
        addFilter
    }}