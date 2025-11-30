export default (date: string) => {
    return `${(new Date()).getUTCFullYear()}-${date.split('/')[1]}-${date.split('/')[0]}`
}