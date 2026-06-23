// src/system/extract-style-props.test.ts
import { describe, it, expect } from "vitest";
import { extractStyleProps } from "./extract-style-props";

describe("extractStyleProps", () => {
  // ─── StyleProps ───────────────────────────────────────────────
  describe("styleProps", () => {
    it("separa margin a styleProps", () => {
      const { styleProps, componentProps } = extractStyleProps({ m: "md" });
      expect(styleProps).toHaveProperty("m", "md");
      expect(componentProps).not.toHaveProperty("m");
    });

    it("separa padding a styleProps", () => {
      const { styleProps, componentProps } = extractStyleProps({
        p: "sm",
        px: "lg",
      });
      expect(styleProps).toHaveProperty("p", "sm");
      expect(styleProps).toHaveProperty("px", "lg");
      expect(componentProps).not.toHaveProperty("p");
      expect(componentProps).not.toHaveProperty("px");
    });

    it("separa color y bg a styleProps", () => {
      const { styleProps } = extractStyleProps({
        color: "primary.500",
        bg: "neutral.100",
      });
      expect(styleProps).toHaveProperty("color", "primary.500");
      expect(styleProps).toHaveProperty("bg", "neutral.100");
    });

    it("separa display y flex a styleProps", () => {
      const { styleProps } = extractStyleProps({
        display: "flex",
        align: "center",
        justifyContent: "space-between",
        gap: "sm",
      });
      expect(styleProps).toHaveProperty("display", "flex");
      expect(styleProps).toHaveProperty("align", "center");
      expect(styleProps).toHaveProperty("justifyContent", "space-between");
      expect(styleProps).toHaveProperty("gap", "sm");
    });

    it("separa dimensiones a styleProps", () => {
      const { styleProps } = extractStyleProps({ w: "full", h: "200px" });
      expect(styleProps).toHaveProperty("w", "full");
      expect(styleProps).toHaveProperty("h", "200px");
    });

    it("separa position a styleProps", () => {
      const { styleProps } = extractStyleProps({
        position: "absolute",
        top: "md",
        zIndex: 10,
      });
      expect(styleProps).toHaveProperty("position", "absolute");
      expect(styleProps).toHaveProperty("top", "md");
      expect(styleProps).toHaveProperty("zIndex", 10);
    });
  });

  // ─── componentProps ───────────────────────────────────────────
  describe("componentProps", () => {
    it("pasa onClick a componentProps", () => {
      const fn = () => {};
      const { componentProps, styleProps } = extractStyleProps({ onClick: fn });
      expect(componentProps).toHaveProperty("onClick", fn);
      expect(styleProps).not.toHaveProperty("onClick");
    });

    it("pasa href a componentProps", () => {
      const { componentProps } = extractStyleProps({ href: "/home" });
      expect(componentProps).toHaveProperty("href", "/home");
    });

    it("pasa data-testid a componentProps", () => {
      const { componentProps } = extractStyleProps({ "data-testid": "mi-box" });
      expect(componentProps).toHaveProperty("data-testid", "mi-box");
    });

    it("pasa type a componentProps", () => {
      const { componentProps } = extractStyleProps({ type: "submit" });
      expect(componentProps).toHaveProperty("type", "submit");
    });

    it("pasa aria-label a componentProps", () => {
      const { componentProps } = extractStyleProps({
        "aria-label": "descripción",
      });
      expect(componentProps).toHaveProperty("aria-label", "descripción");
    });
  });

  // ─── Mixto ────────────────────────────────────────────────────
  describe("mixto — StyleProps y componentProps juntos", () => {
    it("separa correctamente props mixtas", () => {
      const { styleProps, componentProps } = extractStyleProps({
        p: "md",
        bg: "primary.500",
        onClick: () => {},
        href: "/home",
        "aria-label": "caja",
      });

      expect(styleProps).toHaveProperty("p", "md");
      expect(styleProps).toHaveProperty("bg", "primary.500");
      expect(componentProps).toHaveProperty("onClick");
      expect(componentProps).toHaveProperty("href", "/home");
      expect(componentProps).toHaveProperty("aria-label", "caja");

      expect(componentProps).not.toHaveProperty("p");
      expect(componentProps).not.toHaveProperty("bg");
      expect(styleProps).not.toHaveProperty("onClick");
      expect(styleProps).not.toHaveProperty("href");
    });
  });

  // ─── Edge cases ───────────────────────────────────────────────
  describe("edge cases", () => {
    it("retorna objetos vacíos con props vacías", () => {
      const { styleProps, componentProps } = extractStyleProps({});
      expect(Object.keys(styleProps)).toHaveLength(0);
      expect(Object.keys(componentProps)).toHaveLength(0);
    });

    it("preserva valores undefined en componentProps", () => {
      const { componentProps } = extractStyleProps({ onClick: undefined });
      expect(componentProps).toHaveProperty("onClick", undefined);
    });

    it("preserva valores undefined en styleProps", () => {
      const { styleProps } = extractStyleProps({ p: undefined });
      expect(styleProps).toHaveProperty("p", undefined);
    });

    it("preserva valores null en componentProps", () => {
      const { componentProps } = extractStyleProps({ onClick: null });
      expect(componentProps).toHaveProperty("onClick", null);
    });

    it("preserva valores numéricos en styleProps", () => {
      const { styleProps } = extractStyleProps({ zIndex: 10, opacity: 0.5 });
      expect(styleProps).toHaveProperty("zIndex", 10);
      expect(styleProps).toHaveProperty("opacity", 0.5);
    });

    it("preserva valores de objeto responsive en styleProps", () => {
      const responsive = { base: "sm", md: "lg" };
      const { styleProps } = extractStyleProps({ mt: responsive });
      expect(styleProps).toHaveProperty("mt", responsive);
    });
  });
});
