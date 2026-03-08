import { useEffect, useState } from 'react';

/**
 * Hook to subscribe to engine selection changes.
 * Pass in the engine instance from context or props.
 */
export function useSelection(engine: any) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        if (!engine) return;

        // Initialize with current selection
        setSelectedIds(engine.selection.selected.map((n: any) => n.id));

        const handleSelectionChange = (event: { selected: string[] }) => {
            setSelectedIds(event.selected);
        };

        engine.events.on('selection:change', handleSelectionChange);

        return () => {
            engine.events.off('selection:change', handleSelectionChange);
        };
    }, [engine]);

    return selectedIds;
}
