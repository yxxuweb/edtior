export interface Snippet {
    title: string;
    screenshot?: string;
    schema: any; // NodeSchema
}

export interface Material {
    componentName: string;
    title: string;
    icon?: any;
    component: any; // Runtime component implementation
    designer?: any; // Designer specific behavior/component
    propsSchema: any; // JSON Schema for props
    snippets?: Snippet[];
}
