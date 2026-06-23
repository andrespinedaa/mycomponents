import type { FactoryComponentReturn, FactoryConfig, FactoryStatics } from ".";

export function factoryMeta<Config extends FactoryConfig>(
  Component: FactoryComponentReturn<Config>,
  componentName?: string,
  statics?: FactoryStatics,
): FactoryComponentReturn<Config> {
  if (componentName) {
    Component.displayName = componentName;
  }

  if (statics && Object.keys(statics).length > 0) {
    Object.entries(statics).forEach(([key, SubComponent]) => {
      if (componentName) {
        SubComponent.displayName = `${componentName}.${key}`;
      }
    });
    Object.assign(Component, statics);
  }

  return Component;
}
