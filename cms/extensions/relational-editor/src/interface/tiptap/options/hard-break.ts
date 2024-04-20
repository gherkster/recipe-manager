// https://tiptap.dev/api/nodes/hard-break

import HardBreak from "@tiptap/extension-hard-break";
import customMessages from "../../i18n/custom-messages";
import type { Editor } from "@tiptap/core";
import { Tool } from "../../../common/types/tools";

export default {
  key: "hardBreak",
  name: customMessages.tools.hard_break,
  icon: "keyboard_return",
  extension: [HardBreak],
  shortcut: ["shift", "Enter"],
  disabledInSingleLineMode: true,
  action: (editor: Editor) => editor.chain().focus().setHardBreak().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().setHardBreak().run(),
  active: () => false,
} as Tool;
