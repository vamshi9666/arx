import * as fs from "node:fs/promises";
import * as path from "node:path";

export async function cleanDir() {
  fs.readdir(path.resolve(path.join("dist"))).then((currentFiles) => {
    currentFiles.forEach((eachFilePath) => {
      fs.unlink(path.join("dist", eachFilePath));
    });
    // console.log("types ", typeof currentFiles, Array.isArray(currentFiles));
  });
}
