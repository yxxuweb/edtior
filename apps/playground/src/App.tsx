import { useEffect, useState } from 'react';
import { Layout, Button, Card, Space, Typography } from 'antd';
import { Engine, Material, Node } from '@lowcode/core';
import { Renderer, ReactRenderClass, useSelection } from '@lowcode/renderer-react';
import { DndContext, useDraggable, DragEndEvent } from '@dnd-kit/core';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

// --- Draggable Material Wrapper ---
const DraggableMaterialItem = ({ material }: { material: Material }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `material-${material.componentName}`,
        data: { type: 'material', componentName: material.componentName }
    });

    return (
        <div ref={setNodeRef} {...listeners} {...attributes} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <Card
                size="small"
                style={{ width: '100%', cursor: 'grab', marginBottom: 8 }}
                hoverable
            >
                {material.title}
            </Card>
        </div>
    );
};

// --- Mock Materials with Drop Support ---
const DivMaterial: Material = {
    componentName: 'Div',
    title: 'Container (Div)',
    component: ({ children, style, __setNodeRef, __isOver, ...props }: any) => (
        <div
            ref={__setNodeRef}
            style={{
                padding: 10,
                border: __isOver ? '2px solid #1890ff' : '1px dashed #ccc',
                minHeight: 30,
                background: __isOver ? '#e6f7ff' : '#fff',
                transition: 'all 0.2s',
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    ),
    propsSchema: {}
};

const TextMaterial: Material = {
    componentName: 'Text',
    title: 'Text',
    component: ({ content, __setNodeRef, __isOver, ...props }: any) => (
        <span
            ref={__setNodeRef}
            style={{
                border: __isOver ? '1px solid #1890ff' : 'none',
                display: 'inline-block'
            }}
            {...props}
        >
            {content || 'Default Text'}
        </span>
    ),
    propsSchema: {}
};

const ButtonMaterial: Material = {
    componentName: 'Button',
    title: 'Button',
    component: ({ children, __setNodeRef, __isOver, ...props }: any) => (
        <button
            ref={__setNodeRef}
            style={{ border: __isOver ? '2px solid #1890ff' : undefined }}
            {...props}
        >
            {children || 'Button'}
        </button>
    ),
    propsSchema: {}
};

// Helper to find node (DFS) 
// Placed outside App component to avoid recreation/scoping issues with TS
const findNode = (node: Node, id: string): Node | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
    }
    return null;
};

function App() {
    const [engine] = useState(() => new Engine({
        renderClass: new ReactRenderClass(),
        mode: 'edit'
    }));
    const [ready, setReady] = useState(false);

    // Subscribe to selection
    const selectedIds = useSelection(engine);
    const selectedNodeId = selectedIds.length > 0 ? selectedIds[0] : null;
    let selectedNode: Node | null = null;
    if (selectedNodeId && engine.currentDocument) {
        selectedNode = findNode(engine.currentDocument.root, selectedNodeId);
    }

    useEffect(() => {
        // Register Materials
        engine.material.register(DivMaterial);
        engine.material.register(TextMaterial);
        engine.material.register(ButtonMaterial);

        // Load Initial Schema
        engine.load({
            id: 'root',
            componentName: 'Div',
            props: { style: { background: '#f0f2f5', height: '100%', padding: 20 } },
            children: [
                {
                    id: 'text-1',
                    componentName: 'Text',
                    props: { content: 'Drag materials here!' }
                }
            ]
        });

        setReady(true);
    }, [engine]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.data.current?.type === 'material') {
            const componentName = active.data.current.componentName;
            const targetNodeId = over.id as string;

            const targetNode = findNode(engine.currentDocument!.root, targetNodeId);
            if (targetNode) {
                const newNode = new Node({
                    id: `node-${Date.now()}`,
                    componentName,
                    props: componentName === 'Text' ? { content: 'New Text' } : {}
                });

                // Later: use Engine/Command for history support
                targetNode.appendChild(newNode);

                // Trigger React UI update since renderer natively doesn't deeply watch nodes yet
                engine.events.emit('engine:ready', undefined);
            }
        }
    };

    // Handle click on canvas background to deselect
    const handleCanvasClick = (e: React.MouseEvent) => {
        // If they click directly on the background (not bubbling up from a NodeWrapper)
        if (e.target === e.currentTarget) {
            engine.selection.clear();
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <Layout style={{ height: '100vh' }}>
                <Header style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Title level={4} style={{ margin: 0 }}>LowCode Playground</Title>
                    <Space>
                        <Button onClick={() => engine.history.undo()}>Undo</Button>
                        <Button onClick={() => engine.history.redo()}>Redo</Button>
                    </Space>
                </Header>
                <Layout>
                    <Sider width={250} theme="light" style={{ borderRight: '1px solid #eee', padding: 10 }}>
                        <Title level={5}>Materials</Title>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {engine.material.getAll().map((item: Material) => (
                                <DraggableMaterialItem key={item.componentName} material={item} />
                            ))}
                        </div>
                    </Sider>
                    <Content style={{ padding: 20, background: '#fafafa' }} onClick={handleCanvasClick}>
                        <div style={{ background: '#fff', height: '100%', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                            {ready && <Renderer engine={engine} />}
                        </div>
                    </Content>
                    <Sider width={300} theme="light" style={{ borderLeft: '1px solid #eee', padding: 10 }}>
                        <Title level={5}>Attributes</Title>
                        <div style={{ padding: 20 }}>
                            {selectedNode ? (
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <p><strong>ID:</strong> {selectedNode.id}</p>
                                    <p><strong>Component:</strong> {selectedNode.componentName}</p>
                                    {/* Simple MVP prop display / edit could go here */}
                                </Space>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#999' }}>
                                    Select a node to edit
                                </div>
                            )}
                        </div>
                    </Sider>
                </Layout>
            </Layout>
        </DndContext>
    );
}

export default App;
