import { Material } from './types';
import { LoggerFactory } from '@lowcode/utils-logger';

const logger = LoggerFactory.getLogger('MaterialRegistry');

export class MaterialRegistry {
    private materials = new Map<string, Material>();

    register(material: Material) {
        if (this.materials.has(material.componentName)) {
            logger.warn(`Material ${material.componentName} already registered. Overwriting.`);
        }
        this.materials.set(material.componentName, material);
        logger.info(`Material registered: ${material.componentName}`);
    }

    get(componentName: string): Material | undefined {
        return this.materials.get(componentName);
    }

    getAll(): Material[] {
        return Array.from(this.materials.values());
    }
}
