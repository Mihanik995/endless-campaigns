interface Data {
    [key: string]: boolean | { length: number }
}

export default function <T extends Data>(data: T) {
    for (const key in data) {
        if (typeof data[key] === 'boolean') {
            continue;
        }
        if (data[key].length <= 0) {
            throw new Error(`Field '${key}' should be filled!`)
        }
    }
}