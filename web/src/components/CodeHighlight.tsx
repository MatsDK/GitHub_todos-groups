import React from "react";
import { detectLanguage } from "../utils/todoUtils";
import Prism from "prismjs";
import "prismjs/plugins/line-numbers/prism-line-numbers";

interface Props {
  fileData: string;
  path: string;
  startNumber: number;
}

const CodeHighlight: React.FC<Props> = ({ fileData, path, startNumber }) => {
  const lang = detectLanguage(path);

  import(`prismjs/components/prism-${lang}`)
    .then(() => {
      Prism.highlightAll();
    })
    .catch((e) => {
      console.log(e);
    });

  return (
    <div>
      <pre className={`language-${lang} line-numbers`} data-start={startNumber}>
        <code>{fileData}</code>
      </pre>
    </div>
  );
};

export default CodeHighlight;
