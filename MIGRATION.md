# About

Current document describes how to migrate zb-projects which using *CuteJS* implicitly as internal dependency
of *Zombiebox* using *CuteJS* as zombiebox-extension explicitly.

# Instruction

1. Add `zombiebox-extension-cutejs` in project's `package.json` along with other ZB extensions.
2. Replace all existing imports paths according to this `before->after` map:
   
     * `zb/widgets/abstract-cute-widget` -> `cutejs/widgets/abstract-widget`
     * `zb/widgets/inline-widget` -> `cutejs/widgets/inline-widget`
     * `zb/layers/abstract-cute-popup` -> `cutejs/layers/abstract-popup`
     * `zb/layers/abstract-cute-scene` -> `cutejs/layers/abstract-scene`
     * `cutejs/cute-library` -> `cutejs-lib/cute-library`
