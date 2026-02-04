# Visual Invariants

## Non-Negotiable Design Elements

The following visual elements must preserve their **function and shape** in the v2 redesign. Minor styling updates (shadows, colors, borders) are permitted while maintaining the core visual identity:

### 1. Book-Shaped Containers and Buttons
- **Shape**: Rectangular containers with one curved corner (top-right)
- **Corner Radius**: `border-radius: 0 8vw 0 0` (viewport-relative sizing)
- **Purpose**: Creates "open book" silhouette for content areas
- **Application**: Main content containers, form panels, card layouts

### 2. Header Open-Book Motif (SVG)
- **Asset**: `/images/book.svg` 
- **Specifications**: 32×24 viewBox, white fill paths
- **Usage**: Navigation icons, header elements, small decorative elements
- **Preservation**: Exact SVG paths and proportions must be maintained

### 3. Logo Open-Book Motif (SVG)
- **Asset**: `/images/logo.svg`
- **Colors**: Brand blue (#3760AC) and yellow (#C8C42D)
- **Usage**: Primary branding, official documents, headers
- **Preservation**: Exact brand colors, dimensions, and visual treatment required

### 4. ReadingGoalRing
- **Design**: Circular progress visualization with stroke-dasharray
- **Colors**: Stroke #3760AC, background #E6EAF1
- **Overflow Behavior**: Multiple overlapping circles for progress >100%
- **Mathematics**: 31.4px circumference, dynamic dasharray calculation
- **Preservation**: Exact overflow logic and visual stacking must be maintained

## Implementation Requirements

- Core shapes and functional behavior must be preserved
- Proportions and fundamental structure are immutable
- User familiarity with these motifs must be maintained
- Minor styling updates allowed (e.g., updated shadows, refined colors, modern borders)
- Technical implementation may be updated (CSS/Vue) while preserving shape and function

## Reference Documentation

Complete specifications and assets located in `/design/legacy-motifs/`

These invariants ensure visual continuity and brand consistency while allowing technical modernization underneath.