import type { CSSProperties } from "react";
import {
  ComponentFactory,
  type ComponentConfig,
  type EmptyStatics,
} from "../../../factory";
import type { ColorValue } from "../../../theme/generators/system-css.data";

export interface DividerOwnProps {
  orientation?: "horizontal" | "vertical";
  thickness?: CSSProperties["borderWidth"];
  color?: ColorValue;
  label?: string;
}

export type DividerConfig = ComponentConfig<{
  componentName: "Divider";
  defaultTag: "div";
  ownProps: DividerOwnProps;
  statics: EmptyStatics;
  defaultProps: { orientation: "horizontal" };
}>;

export const Divider = ComponentFactory<DividerConfig>({
  componentName: "Divider",
  defaultTag: "div",
  defaultProps: { orientation: "horizontal" },
  render: ({ orientation, thickness = "1px", color, label, style, ...rest }) => {
    const isVertical = orientation === "vertical";

    const lineStyle: CSSProperties = isVertical
      ? {
          display: "inline-block",
          width: 0,
          alignSelf: "stretch",
          borderLeft: `${thickness} solid`,
          borderColor: color as string | undefined,
        }
      : {
          width: "100%",
          borderTop: `${thickness} solid`,
          borderColor: color as string | undefined,
        };

    if (label) {
      return (
        <div
          role="separator"
          aria-orientation={orientation}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", ...style }}
          {...(rest as any)}
        >
          <div style={{ flex: 1, ...lineStyle }} />
          <span style={{ whiteSpace: "nowrap" }}>{label}</span>
          <div style={{ flex: 1, ...lineStyle }} />
        </div>
      );
    }

    return (
      <div
        role="separator"
        aria-orientation={orientation}
        style={{ ...lineStyle, ...style }}
        {...(rest as any)}
      />
    );
  },
});
