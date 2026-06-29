# MyComponents

A React design system built around a single principle: **the system owns the infrastructure, the component only declares its behavior**.

## Philosophy

`render` is not a component. It is the view. Hooks are the infrastructure. `ComponentFactory` separates both responsibilities so they never mix.

When you call `ComponentFactory`, before your `render` runs a single line, the system has already resolved the theme, injected the component's CSS lazily into the CSSOM, merged props in the correct priority order, applied `data-slot` and `data-mod` attributes, and forwarded the typed ref. Your `render` receives all of that as a single context object — it only needs to describe what to render, not how to mount.

This is why you can't call hooks directly inside `render`: `render` is a plain function called from inside a `forwardRef` callback. React only sees the outer component. If you need a hook (parent context, local state), it goes in `useHooks` — which runs at the component root and delivers its result as `hooks` in the ctx object.

```ts
ComponentFactory<Config>({
  componentName: "Divider",
  defaultTag: "div",
  useHooks: () => ({ card: useCardContext() }),   // hooks run here — component root
  render: ({ orientation, ref, theme: _t, hooks: { card }, ...rest }) => {
    // render runs here — plain function, no hooks allowed
    const resolved = orientation ?? card.orientation ?? "horizontal";
    return <Box ref={ref} apply="@dividerLineH" {...rest} />;
  },
});
```

The consumer gets every prop category in one typed object: OwnProps, StyleProps, BaseProps, HTML attributes, ref, theme, and hooks. They destructure what they need and spread the rest — the primitives (Box, Flex, Text) know how to process everything else.
