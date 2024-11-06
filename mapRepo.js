import dirTree from "directory-tree";
import fs from "fs";

export function mapRepo() {
  fs.writeFileSync(
    "./repo.json",
    JSON.stringify(
      dirTree("./", {
        exclude: [/node_modules/, /git/],
      })
    )
  );
  console.log("Repo has been mapped");
}
