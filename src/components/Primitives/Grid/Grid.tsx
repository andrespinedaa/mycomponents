import { ComponentFactory } from "../../../factory";
import type {
  ComponentConfig,
  EmptyStatics,
} from "../../../factory/factories.types";
import { Box } from "../Box";

// ─── GridBox.Item ─────────────────────────────────────────────────────────────
export interface GridItemOwnProps {
  colSpan?: number | "full";
  rowSpan?: number | "full";
  colStart?: number | "auto";
  colEnd?: number | "auto";
  rowStart?: number | "auto";
  rowEnd?: number | "auto";
}

export type GridItemConfig = ComponentConfig<{
  componentName: "GridItem";
  defaultTag: "div";
  ownProps: GridItemOwnProps;
  statics: EmptyStatics;
  defaultsProps: {};
}>;

const GridItem = ComponentFactory<GridItemConfig>({
  componentName: "GridItem",
  defaultTag: "div",
  render: (resolvedProps) => {
    const { colSpan, rowSpan, colStart, colEnd, rowStart, rowEnd, ...rest } =
      resolvedProps;

    const resolveSpan = (span?: number | "full") =>
      span === "full" ? "1 / -1" : span ? `span ${span}` : undefined;

    return (
      <Box
        gridRow={`${
          rowSpan
            ? resolveSpan(rowSpan)
            : rowStart || rowEnd
            ? `${rowStart ?? "auto"} / ${rowEnd ?? "auto"}`
            : undefined
        }`}
        gridColumn={`${
          colSpan
            ? resolveSpan(colSpan)
            : colStart || colEnd
            ? `${colStart ?? "auto"} / ${colEnd ?? "auto"}`
            : undefined
        }`}
        {...rest}
      />
    );
  },
});

// ─── GridBox ──────────────────────────────────────────────────────────────────
export interface GridBoxOwnProps {
  columns?: number | string;
  rows?: number | string;
  autoColumns?: string;
  autoRows?: string;
  inline?: boolean;
}

export type GridBoxConfig = ComponentConfig<{
  componentName: "GridBox";
  defaultTag: "div";
  ownProps: GridBoxOwnProps;
  statics: { Item: typeof GridItem };
  defaultsProps: {};
}>;

export const GridBox = ComponentFactory<GridBoxConfig>({
  componentName: "GridBox",
  defaultTag: "div",
  render: (resolvedProps, ref) => {
    const { columns, rows, autoColumns, autoRows, inline, ...rest } =
      resolvedProps;

    const resolveTemplate = (value?: number | string) =>
      value === undefined
        ? "0"
        : typeof value === "number"
        ? `repeat(${value}, 1fr)`
        : value;

    return (
      <Box
        ref={ref}
        display={inline ? "inline-grid" : "grid"}
        gridTemplateColumns={resolveTemplate(columns)}
        gridTemplateRows={resolveTemplate(rows)}
        gridAutoColumns={`${autoColumns}`}
        gridAutoRows={`${autoRows}`}
        {...rest}
      />
    );
  },
  statics: { Item: GridItem },
});
