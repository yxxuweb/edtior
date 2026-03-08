export declare interface Material {
    componentName: string;
    title: string;
    icon?: any;
    component: any;
    designer?: any;
    propsSchema: any;
    snippets?: Snippet[];
}

export declare class MaterialRegistry {
    private materials;
    register(material: Material): void;
    get(componentName: string): Material | undefined;
    getAll(): Material[];
}

export declare interface Snippet {
    title: string;
    screenshot?: string;
    schema: any;
}

export { }
