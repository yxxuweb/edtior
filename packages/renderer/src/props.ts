/**
 * Compute resolved props from raw node props.
 * 
 * Currently a simplified pass-through implementation.
 * Future: resolve JSExpression, JSFunction, and other dynamic value types.
 */
export function computeProps(props: Record<string, any>): Record<string, any> {
    const resolved: Record<string, any> = {};

    for (const [key, value] of Object.entries(props)) {
        if (value && typeof value === 'object' && value.type === 'JSExpression') {
            // TODO: Implement expression evaluation with sandbox
            // For now, store the raw expression value as a placeholder
            resolved[key] = value.value;
        } else if (value && typeof value === 'object' && value.type === 'JSFunction') {
            // TODO: Implement function evaluation with sandbox
            resolved[key] = value.value;
        } else {
            resolved[key] = value;
        }
    }

    return resolved;
}
