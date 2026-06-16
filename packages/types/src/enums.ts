import type { LayerModel, PropertyModel } from "./index";

export enum SocialType {
  X = "x",
  Instagram = "instagram",
  Facebook = "facebook",
  Linkedin = "linkedin",
  Discord = "discord",
  Dribbble = "dribbble",
  Behance = "behance",
  Signal = "signal",
  Snap = "snap",
  Telegram = "telegram",
  Tiktok = "tiktok",
  Pinterest = "pinterest",
  Reddit = "reddit",
  Twitch = "twitch",
  Youtube = "youtube",
  Github = "github",
}

export enum LayerTypeEnum {
  Solid = "solid",
  ShapeLayer = "shape",
  Null = "null",
  Text = "text",
  AdjustmentLayer = "adjustment",
  Precomp = "precomp",
  Any = "any",
}

export const LayerEnums: Record<LayerTypeEnum, LayerModel> = {
  solid: { name: "Solid", type: LayerTypeEnum.Solid },
  shape: { name: "Shape Layer", type: LayerTypeEnum.ShapeLayer },
  null: { name: "Null", type: LayerTypeEnum.Null },
  text: { name: "Text", type: LayerTypeEnum.Text },
  adjustment: { name: "Adjustment Layer", type: LayerTypeEnum.AdjustmentLayer },
  precomp: { name: "Precomp", type: LayerTypeEnum.Precomp },
  any: { name: "Any", type: LayerTypeEnum.Any },
};

export enum PropertyGroupEnum {
  Transform = "transform",
  Content = "content",
  Text = "text",
  Effects = "effects",
  Mask = "mask",
}

export const PropertyEnums: Record<string, PropertyModel> = {
  // Transform
  position: { name: "Position", group: PropertyGroupEnum.Transform },
  scale: { name: "Scale", group: PropertyGroupEnum.Transform },
  rotation: { name: "Rotation", group: PropertyGroupEnum.Transform },
  opacity: { name: "Opacity", group: PropertyGroupEnum.Transform },
  anchorPoint: { name: "Anchor Point", group: PropertyGroupEnum.Transform },
  // Content
  path: { name: "Path", group: PropertyGroupEnum.Content },
  fill: { name: "Fill", group: PropertyGroupEnum.Content },
  stroke: { name: "Stroke", group: PropertyGroupEnum.Content },
  strokeWidth: { name: "Stroke Width", group: PropertyGroupEnum.Content },
  // Text
  sourceText: { name: "Source Text", group: PropertyGroupEnum.Text },
  fontSize: { name: "Font Size", group: PropertyGroupEnum.Text },
  tracking: { name: "Tracking", group: PropertyGroupEnum.Text },
  // Effects
  slider: { name: "Slider Control", group: PropertyGroupEnum.Effects },
  color: { name: "Color Control", group: PropertyGroupEnum.Effects },
  checkbox: { name: "Checkbox Control", group: PropertyGroupEnum.Effects },
  point: { name: "Point Control", group: PropertyGroupEnum.Effects },
  // Mask
  maskPath: { name: "Mask Path", group: PropertyGroupEnum.Mask },
  maskOpacity: { name: "Mask Opacity", group: PropertyGroupEnum.Mask },
  maskFeather: { name: "Mask Feather", group: PropertyGroupEnum.Mask },
  maskExpansion: { name: "Mask Expansion", group: PropertyGroupEnum.Mask },
};
