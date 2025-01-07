//Tue Dec 03 2024
export const handleDate = (date) => {
    let day = date.slice(8, 10);
    let mon = date.slice(4, 7);
    let year = date.slice(11, date.length)
    let month = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
    }
    return `${day}/${month[mon]}/${year}`
}