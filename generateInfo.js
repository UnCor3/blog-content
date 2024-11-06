//use this file to generate info.json for a blog
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { mapRepo } from "./mapRepo.js";

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
      keywords: answers.keywords.split(",").map((keyword) => keyword.trim()),
      tags: answers.tags.split(",").map((tag) => tag.trim()),
    };

    // Generate the JSON string
    const jsonContent = JSON.stringify(infoData, null, 2); // pretty print with 2 spaces

    // Specify the path where the JSON file will be saved
    const outputDir = path.resolve(import.meta.dirname, answers.slug);

    const outputPath = path.resolve(
      import.meta.dirname,
      answers.slug,
      "info.json"
    );

    //any file name with .mdx extension
    const mdxPath = path.resolve(
      import.meta.dirname,
      answers.slug,
      "index.mdx"
    );

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true }); // Creates the directory if it doesn't exist
    }

    // Write the JSON to a file
    fs.writeFileSync(outputPath, jsonContent);
    fs.writeFileSync(outputPath, mdxPath);
    mapRepo();
    console.log("info.json has been successfully generated!");
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
  date: new Date().toISOString().split("T")[0], // today's date in YYYY-MM-DD format
  author: "Anonymous",
  slug: "untitled-post",
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
    message: "Enter a preview title (seen in pagination):",
    default: defaultData.previewTitle,
  },
  {
    type: "input",
    name: "desc",
    message: "Enter a description (for SEO and preview):",
    default: defaultData.desc,
  },
  {
    type: "input",
    name: "author",
    message: "Enter the author name:",
    default: defaultData.author,
  },
  {
    type: "input",
    name: "slug",
    message: "Enter the slug (randomization will be handled):",
    default: defaultData.slug,
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
    name: "image",
    message: "Enter the image URL (will be seen in pagination):",
    default: defaultData.image,
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
];

generateInfoFile();
