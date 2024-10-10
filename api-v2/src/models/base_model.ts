export function optionsGenerater(options, table) {
    const conditions = [];
    const parameters = {};
    for (const [key, value] of Object.entries(options)) {
        if (value === undefined || value === '' || value === null) continue;
        switch (key) {
            case 'updateDate':
                conditions.push(` ${table}.${key} BETWEEN :updateStart AND :updateEnd `)
                parameters[key] = {
                    updateStart: options[key][0],
                    updateEnd: options[key][1]
                };
                break
            case 'productName':
                conditions.push(` ${table}.${key} LIKE :${key} `)
                parameters[key] = `%${value}%`;
                break
            default:
                if (Array.isArray(value)) {
                    const placeholders = value.map((_, index) => `:${key}${index}`).join(', ');
                    conditions.push(`${table}.${key} IN (${placeholders})`);
                    value.forEach((val, index) => {
                        parameters[`${key}${index}`] = val;
                    });
                } else {
                    conditions.push(` ${table}.${key} = :${key} `);
                    parameters[key] = value;
                }
                break
        }
    }
    return { conditions, parameters }
}