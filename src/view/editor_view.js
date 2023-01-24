import {schema} from "prosemirror-schema-basic"
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import m from "mithril"


module.exports = {
  oninit(){
    let state = EditorState.create({schema})
    let view = new EditorView(document.body, {state})
    this.view = view;
    this.state = state;
  }
  view(){
    return this.view;
  }
}