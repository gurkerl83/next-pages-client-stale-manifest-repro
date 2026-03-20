import type { ComponentType } from 'react';

import type { DemoBlock } from '../lib/demo-page';

type ComponentRegistry = {
  RewrittenOnlyComponent?: ComponentType;
};

type DocRendererProps = {
  blocks: DemoBlock[];
  registry: ComponentRegistry;
};

export function DocRenderer({ blocks, registry }: DocRendererProps) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {blocks.map((block, index) => {
        if (block.kind === 'paragraph') {
          return <p key={index}>{block.text}</p>;
        }

        const HandlerOnlyComponent = registry.RewrittenOnlyComponent;

        if (HandlerOnlyComponent == null) {
          throw new Error(
            'Expected component `RewrittenOnlyComponent` to be defined. The rewritten page data is being rendered by the catch-all page component.'
          );
        }

        return <HandlerOnlyComponent key={index} />;
      })}
    </div>
  );
}
