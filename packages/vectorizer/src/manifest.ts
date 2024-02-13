export const PLUGIN_ID = 'imgly/plugin-vectorizer-web';
export const PLUGIN_COMPONENT_BUTTON_ID = `component.${PLUGIN_ID}.button`;
export const PLUGIN_ACTION_VECTORIZE_LABEL = `plugin.${PLUGIN_ID}.vectorize`


export default {
    id: PLUGIN_ID,
    publisher: "IMG.LY",
    contributes: {
        ui: [
            {
                id: PLUGIN_COMPONENT_BUTTON_ID,
            }
        ],
        commands: {
            // maybe we don't need the manifest after all? 
            [PLUGIN_ACTION_VECTORIZE_LABEL]: {
                title: "Turn into Vectorpath", //default when no translation is given
            }
        },
        i18n: {
            en: {
                [PLUGIN_ACTION_VECTORIZE_LABEL]: 'Turn into Vectorpaths'
            },
            de: {
                [PLUGIN_ACTION_VECTORIZE_LABEL]: 'Wandle in Vectorpfade'
            }
        }
    }
}