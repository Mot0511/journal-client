export default (lessons: any[]) => {
    lessons.sort((a, b) => {
        const date1 = new Date(a.Date)
        const date2 = new Date(b.Date)
        return date1.getTime() - date2.getTime()
    })
}