export default async function hash(algorithm: string, input: string) {
    const arrayBuffer = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input));
    const array = Array.from(new Uint8Array(arrayBuffer));
    return array.map(b => b.toString(16).padStart(2, '0')).join('');
}