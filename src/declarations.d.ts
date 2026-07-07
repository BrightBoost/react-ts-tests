// Ambient type declarations for non-TypeScript asset imports.
// These tell the TypeScript compiler used by ts-jest that CSS and
// image files can be imported as side-effects or default values,
// even though the real transform is handled by jest's moduleNameMapper.

declare module "*.css";
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.webp";
