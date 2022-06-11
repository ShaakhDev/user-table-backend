import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('0123456789abc', 10)


export const uid = (limit) =>
    nanoid(limit);

