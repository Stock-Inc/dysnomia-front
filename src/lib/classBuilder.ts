type classConditionPair = [object | boolean | undefined, string];
export default function classBuilder(...inputs: (classConditionPair | string | undefined)[]): string {
    let result = '';
    for (const input of inputs) {
        if (!input) continue;
        if (typeof input === 'string') {
            result += `${input} `;
        } else {
            const [condition, className] = input;
            if (condition) result += `${className} `;
        }
    }
    return result.trim();
}
