export default () => {
  // eslint-disable-next-line no-restricted-globals
  self.addEventListener("message", e => {
    if (!e) return;

    // console.log(e);
    let progress = 0;
    let oldProgress = 0;
    const extensions = ["txt", "cpp", "h", "py", "c"];
    for (let i = 0; i < e.data["files"].length; i++) {
      progress = parseInt(((i + 1) / e.data["files"].length) * 100);
      const fileName = e.data["files"][i].name.split(".");
      const extension = fileName[fileName.length - 1];

      if (extensions.indexOf(extension) < 0) {
        continue;
      }

      (function(outerFile) {
        const reader = new FileReader();

        reader.onload = function(innerFile) {
          if (outerFile.name.includes(e.data["query"])) {
            postMessage({ name: e.data["files"][i].name });
            return;
          }

          if (innerFile.target.result.includes(e.data["query"])) {
            console.log(innerFile.target.result.includes(e.data["query"]));
            postMessage({ name: e.data["files"][i].name });
          }
        };

        reader.readAsText(outerFile);
      })(e.data["files"][i]);

      if (i % 100 === 0 && oldProgress !== progress) {
        oldProgress = progress;
      }
    }

    postMessage({ progress: 100 });
  });
};
