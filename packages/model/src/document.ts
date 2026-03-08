import { Node, NodeSchema } from './node';
import { DocumentEventEmitter } from './emitter';
import { LoggerFactory } from '@lowcode/utils-logger';

const logger = LoggerFactory.getLogger('Document');

export class Document {
    root: Node;
    // O(1) Lookup Map
    private nodeMap = new Map<string, Node>();
    // Optional emitter to connect to Engine EventBus
    emitter?: DocumentEventEmitter;

    constructor(schema: NodeSchema, emitter?: DocumentEventEmitter) {
        this.emitter = emitter;
        // Instantiating the root will recursively instantiate and link all children
        this.root = new Node(schema, this);
        logger.info('Document initialized with root:', this.root.id);

        // Recursively register all initial nodes
        this.registerNode(this.root);
    }

    getNode(id: string): Node | null {
        return this.nodeMap.get(id) || null;
    }

    /** 
     * Internal method called by Node.insertChild / constructor.
     * Recursively registers a node and its tree into the map.
     */
    registerNode(node: Node) {
        this.nodeMap.set(node.id, node);
        node.document = this;
        for (const child of node.children) {
            this.registerNode(child);
        }
    }

    /**
     * Internal method called by Node.remove.
     * Recursively unregisters a node and its tree from the map.
     */
    unregisterNode(node: Node) {
        for (const child of node.children) {
            this.unregisterNode(child);
        }
        this.nodeMap.delete(node.id);
        node.document = null;
    }

    exportSchema(): NodeSchema {
        return this.root.exportSchema();
    }
}
