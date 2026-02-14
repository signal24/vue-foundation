# CSS Classes Reference

The library uses these CSS classes that you can style to customize the appearance of vue-foundation components.

## Class Reference

| Class                      | Used By              | Description                              |
| -------------------------- | -------------------- | ---------------------------------------- |
| `.vf-overlay`              | Modal, context menu  | Fixed full-screen overlay                |
| `.vf-modal-wrap`           | VfModal              | Modal backdrop (semi-transparent)        |
| `.vf-modal`                | VfModal              | Modal container                          |
| `.vf-modal-header`         | VfModal              | Modal header slot container              |
| `.vf-modal-content`        | VfModal              | Modal content slot container             |
| `.vf-modal-footer`         | VfModal              | Modal footer slot container              |
| `.vf-alert`                | VfAlertModal         | Alert modal wrapper                      |
| `.vf-toast`                | VfToast              | Toast container                          |
| `.vf-tooltip`              | v-tooltip            | Tooltip element                          |
| `.vf-mask`                 | maskEl/maskComponent | Component overlay mask                   |
| `.vf-masked`               | maskForm             | Applied to masked forms                  |
| `.vf-smart-select`         | VfSmartSelect        | Select wrapper                           |
| `.vf-smart-select-options` | VfSmartSelect        | Options dropdown                         |
| `.vf-context-menu`         | showContextMenu      | Context menu                             |
| `.vf-overlay-anchor`       | OverlayAnchor        | Anchored overlay wrapper                 |
| `.vf-modal-open`           | VfModal              | Applied to `<body>` when a modal is open |

## Styling Example

You can override these classes in your application's CSS to match your design system:

```css
.vf-modal {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
    min-width: 320px;
    max-width: 90vw;
    max-height: 90vh;
}

.vf-modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    font-weight: 600;
}

.vf-modal-content {
    padding: 20px;
}

.vf-modal-footer {
    padding: 12px 20px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}

.vf-toast {
    position: fixed;
    z-index: 1002;
    padding: 12px 16px;
    border-radius: 6px;
    background: #333;
    color: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.vf-tooltip {
    position: fixed;
    z-index: 1003;
    background: #333;
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 13px;
}

.vf-context-menu {
    position: fixed;
    z-index: 1003;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    min-width: 160px;
    padding: 4px 0;
}
```
