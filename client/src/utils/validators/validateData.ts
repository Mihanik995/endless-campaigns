import purifyHTML from "./purifyHTML.ts";

interface Data {
    [key: string]: boolean | { length: number }
}

export default function <T extends Data>(data: T) {
    for (const key in data) {
        if (typeof data[key] === 'boolean') {
            continue;
        }
        if (typeof data[key] === 'string') {
            if (data[key].length <= 0) throw new Error(`Field '${key}' should be filled!`)
            if (data[key].includes('</')){
                const purified = purifyHTML(data[key])
                if (purified !== data[key])
                    throw new Error(`Field '${key}' contents inappropriate HTML!`)
            }
        }
    }
}