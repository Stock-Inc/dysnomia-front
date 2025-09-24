type classConditionPair = [string, object | boolean | undefined];
export default function classBuilder(...inputs: (classConditionPair | string | undefined)[]): string {
    let result = '';
    for (const input of inputs) {
        if (!input) continue;
        if (typeof input === 'string') {
            result += `${input} `;
        } else {
            const [className, condition] = input;
            if (condition) result += `${className} `;
        }
    }
    return result.trim();
}
