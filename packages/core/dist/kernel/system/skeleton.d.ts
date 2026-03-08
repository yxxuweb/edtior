export interface SkeletonItem {
    area: 'topbar' | 'sidebar' | 'main' | 'statusbar';
    content: any;
}
export declare class Skeleton {
    private items;
    add(item: SkeletonItem): void;
    remove(item: SkeletonItem): void;
}
