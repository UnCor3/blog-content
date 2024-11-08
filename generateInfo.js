//use this file to generate info.json for a blog
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { mapRepo } from "./mapRepo.js";

const dateOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const slugify = (str) =>
  str.toLowerCase().replaceAll(" ", "-") +
  "-" +
  Math.random().toString(36).substring(7);

async function generateInfoFile() {
  if (process.argv.includes("map")) {
    return mapRepo();
  }

  try {
    const answers = await inquirer.prompt(questions);

    // Create an object with the user input or defaults
    const infoData = {
      ...defaultData,
      ...answers,
      image: `https://github.com/UnCor3/blog-content/blob/main/${answers.slug}/preview.jpg?raw=true`,
      slug: slugify(answers.slug),
      keywords: answers.keywords.split(",").map((keyword) => keyword.trim()),
      tags: answers.tags.split(",").map((tag) => tag.trim()),
    };

    // Generate the JSON string
    const jsonContent = JSON.stringify(infoData, null, 2);

    // Specify the path where the JSON file will be saved
    const outputDir = path.resolve(import.meta.dirname, infoData.slug);

    const outputPath = path.resolve(
      import.meta.dirname,
      infoData.slug,
      "info.json"
    );

    const mdxPath = path.resolve(
      import.meta.dirname,
      infoData.slug,
      infoData.fileName
    );

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the JSON to a file
    fs.writeFileSync(outputPath, jsonContent);
    fs.writeFileSync(mdxPath, "## Start writing your content here");
    fs.copyFile("./preview.jpg", outputDir + "/preview.jpg", (error) => {
      if (error) {
        console.error("Error copying file:", error);
      }
    });

    console.log("info.json has been successfully generated!");
    mapRepo();
    console.log(
      "if you made any mistake, you can edit the info.json file manually."
    );
  } catch (error) {
    console.error("Error generating the info.json file:", error);
  }
}

// Default values
const defaultData = {
  title: "Untitled Post",
  previewTitle: "Preview Title of the Post",
  desc: "No description provided.",
  date: new Date().toLocaleDateString("en-US", dateOptions), // today's date in YYYY-MM-DD format
  author: [{ name: "uncore", link: "https://blog.uncore.me" }],
  keywords: ["blog", "tutorial"],
  image: "/images/default.jpg",
  og: {
    title: "Untitled Post - A Blog Post",
    description: "No description available for this post.",
    image: "/images/default-og.jpg",
  },
  twitter: {
    title: "Untitled Post",
    description: "No description available.",
    image: "/images/default-twitter.jpg",
    card: "summary_large_image",
  },
  tags: ["generic"],
  reading_time: 5,
  type: "blog",
};

// Prompt questions to ask the user
const questions = [
  {
    type: "input",
    name: "title",
    message: "Enter the title of the post:",
    default: defaultData.title,
  },
  {
    type: "input",
    name: "previewTitle",
    message:
      "Enter a preview title which is seen in pagination (defaults to title):",
    default: (answers) => answers.title,
  },
  {
    type: "input",
    name: "desc",
    message: "Enter a description (for SEO and preview):",
    default: defaultData.desc,
  },
  {
    type: "input",
    name: "slug",
    message: "Enter the slug (randomization will be handled):",
    default: (answers) => slugify(answers.title),
  },
  {
    type: "input",
    name: "keywords",
    message:
      "Enter keywords for SEO (JavaScript,Hosting etc ,comma-separated):",
    default: defaultData.keywords.join(", "),
  },
  {
    type: "input",
    name: "tags",
    message: "Enter tags for the post (comma-separated):",
    default: defaultData.tags.join(", "),
  },
  {
    type: "input",
    name: "reading_time",
    message: "Enter the estimated reading time (in minutes):",
    default: defaultData.reading_time.toString(),
  },
  {
    type: "list",
    name: "type",
    message: "Choose the content type:",
    choices: [
      "blog",
      "coding-tutorial",
      "tutorial",
      "news",
      "interview",
      "podcast",
      "video",
      "other",
    ],
    default: defaultData.type,
  },
  {
    type: "input",
    name: "fileName",
    message: "Enter the markdown file name",
    default: "content.mdx",
  },
];

generateInfoFile();
