export function optionsGenerater(options, table) {
    const conditions = [];
    const parameters = {};
    for (const [key, value] of Object.entries(options)) {
        if (value !== undefined && value !== '') {
            conditions.push(`${table}.${key} = :${key}`);
            parameters[key] = value;
        }
    }
    return { conditions, parameters }
}