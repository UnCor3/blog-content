import dirTree from "directory-tree";
import fs from "fs";
import path from "path";
const callback = (item, cb_path) => {
  try {
    //root folder case
    if (cb_path === "./") return;
    const infoFile = path.resolve(cb_path, "info.json");
    const { keywords, tags, image, title, desc } = JSON.parse(
      fs.readFileSync(infoFile, "utf8")
    );
    item.shortInfo = {
      keywords,
      tags,
      image,
      title,
      desc,
    };
  } catch (error) {
    console.error("Error mapping the repo:", error);
  }
};

export function mapRepo() {
  fs.writeFileSync(
    "./repo.json",
    JSON.stringify(
      dirTree(
        "./",
        {
          exclude: [/node_modules/, /git/],
        },
        null,
        callback
      )
    )
  );
  console.log("Repo has been mapped");
}
