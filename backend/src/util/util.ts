export const base64StringEncode = (string: string):string => {
    let buff = Buffer.from(string);
    let base64data = buff.toString('base64');
    return base64data
}

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}