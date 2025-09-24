export default function (filedName: string, data: string) {
    if (data.length <= 0) {
        throw new Error(`${filedName} field is empty!`)
    }
}