import { LoggerFactory } from '@lowcode/utils-logger';

const logger = LoggerFactory.getLogger('Skeleton');

export interface SkeletonItem {
    area: 'topbar' | 'sidebar' | 'main' | 'statusbar';
    content: any;
}

export class Skeleton {
    private items: SkeletonItem[] = [];

    add(item: SkeletonItem) {
        logger.debug(`Adding item to ${item.area}`, item);
        this.items.push(item);
    }

    remove(item: SkeletonItem) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
        }
    }
}
