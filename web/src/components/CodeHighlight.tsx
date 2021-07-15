import React from "react";
import { detectLanguage } from "../utils/todoUtils";
import Prism from "prismjs";

interface Props {
  fileData: string;
  path: string;
}

const CodeHighlight: React.FC<Props> = ({ fileData, path }) => {
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
      <pre className={`language-${lang}`}>
        <code className={`language-${lang}`}>{fileData}</code>
      </pre>
    </div>
  );
};

export default CodeHighlight;
