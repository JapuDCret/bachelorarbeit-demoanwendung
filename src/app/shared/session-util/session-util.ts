export function generateFakeUUID(): string {
    // see https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
    return randomHexString(8) + '-' + randomHexString(4) + '-' + randomHexString(4) + '-' + randomHexString(4) + '-' + randomHexString(12);
}

export function randomHexString(length: number): string {
    var result = '';
    var characters = 'abcdef0123456789';
    var charactersLength = characters.length;
    
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};