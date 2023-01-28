import { Plugin } from "prosemirror-state";
import { zlibSync, unzlibSync } from "fflate";
import { fromByteArray, toByteArray } from "base64-js";
import { Node } from "prosemirror-model";
const persist = (save, load, schema, initialDoc) => {
  const loadDoc = () => {
    let doc = initialDoc;
    let initialContent = load();
    if (initialContent) {
      try {
        const compressed = toByteArray(initialContent);
        const raw = JSON.parse(
          new TextDecoder("utf8").decode(unzlibSync(compressed))
        );
        doc = Node.fromJSON(schema, raw);
      } catch (e) {
        console.error(`Error decoding hash !!! ${e}`);
      }
    }
    return doc;
  };

  const saveDoc = new Plugin({
    state: {
      init(config, state) {
        state.doc = loadDoc();
      },
      apply() {},
    },
    view(view) {
      return {
        update(view, oldState) {
          const raw = new TextEncoder("utf8").encode(
            JSON.stringify(view.state.doc.toJSON())
          );
          const compressed = zlibSync(raw);
          save(fromByteArray(compressed));
        },
      };
    },
  });
  return [saveDoc];
};

export const locationStore = (schema, initialDoc) =>
  persist(
    (e) => (location.hash = e),
    () => location.hash && location.hash.slice(1),
    schema,
    initialDoc
  );

export const localStorageStore = (
  schema,
  initialDoc,
  key = "prosemirror-doc"
) =>
  persist(
    (e) => localStorage.setItem(key, e),
    () => localStorage.getItem(i),
    schema,
    initialDoc
  );
