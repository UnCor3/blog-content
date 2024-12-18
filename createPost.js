//use this file to generate info.json for a blog
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { mapRepo } from './mapRepo.js';
import { createHash } from 'crypto';

const dateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const slugify = (str) => str.toLowerCase().replaceAll(' ', '-');

async function generateInfoFile() {
  if (process.argv.includes('map')) {
    return mapRepo();
  }

  try {
    const answers = await inquirer.prompt(questions);

    // Create an object with the user input or defaults
    const slug = slugify(answers.previewTitle);
    const image = `https://raw.githubusercontent.com/UnCor3/blog-content/refs/heads/main/${slug}/preview.jpg`;
    const infoData = {
      id: createHash('sha1').update(slug).digest('base64'),
      ...defaultData,
      ...answers,
      image,
      slug,
      keywords: answers.keywords.split(',').map((keyword) => keyword.trim()),
      tags: answers.tags.split(',').map((tag) => tag.trim()),
      og: {
        title: answers.title,
        description: answers.desc,
        image,
      },
      twitter: {
        title: answers.title,
        description: answers.desc,
        image,
        card: 'summary_large_image',
      },
    };

    // Generate the JSON string
    const jsonContent = JSON.stringify(infoData, null, 2);

    // Specify the path where the JSON file will be saved
    const outputDir = path.resolve(import.meta.dirname, infoData.slug);

    const outputPath = path.resolve(
      import.meta.dirname,
      infoData.slug,
      'info.json'
    );

    const mdxPath = path.resolve(
      import.meta.dirname,
      infoData.slug,
      infoData.fileName
    );

    if (fs.existsSync(outputDir)) {
      console.error('The folder already exists!', outputDir);
      return process.exit(1);
    }

    fs.mkdirSync(outputDir, { recursive: true });

    // Write the JSON to a file
    fs.writeFileSync(outputPath, jsonContent);
    fs.writeFileSync(mdxPath, '## Start writing your content here');
    fs.copyFile('./preview.jpg', outputDir + '/preview.jpg', (error) => {
      if (error) {
        console.error('Error copying file:', error);
      }
    });

    console.log('info.json has been successfully generated!');
    mapRepo();
    console.log(
      'if you made any mistake, you can edit the info.json file manually.'
    );
  } catch (error) {
    console.error('Error generating the info.json file:', error);
  }
}

// Default values
const defaultData = {
  title: 'Untitled Post',
  previewTitle: 'Preview Title of the Post',
  desc: 'No description provided.',
  date: new Date().toLocaleDateString('en-US', dateOptions), // today's date in YYYY-MM-DD format
  author: [{ name: 'uncore', link: 'https://blog.uncore.me' }],
  keywords: ['blog', 'tutorial'],
  tags: ['generic'],
  reading_time: 5,
  type: 'blog',
};

// Prompt questions to ask the user
const questions = [
  {
    type: 'input',
    name: 'title',
    message: 'Enter the title of the post:',
    default: defaultData.title,
  },
  {
    type: 'input',
    name: 'previewTitle',
    message:
      'Enter a preview title which is seen in pagination (defaults to title):',
    default: (answers) => answers.title,
  },
  {
    type: 'input',
    name: 'desc',
    message: 'Enter a description (for SEO and preview):',
    default: defaultData.desc,
  },
  {
    type: 'input',
    name: 'keywords',
    message:
      'Enter keywords for SEO (JavaScript,Hosting etc ,comma-separated):',
    default: defaultData.keywords.join(', '),
  },
  {
    type: 'input',
    name: 'tags',
    message: 'Enter tags for the post (comma-separated):',
    default: defaultData.tags.join(', '),
  },
  {
    type: 'input',
    name: 'reading_time',
    message: 'Enter the estimated reading time (in minutes):',
    default: defaultData.reading_time.toString(),
  },
  {
    type: 'list',
    name: 'type',
    message: 'Choose the content type:',
    choices: [
      'general',
      'review',
      'announcement',
      'tutorial',
      'news',
      'interview',
      'podcast',
      'video',
      'other',
    ],
    default: defaultData.type,
  },
  {
    type: 'input',
    name: 'fileName',
    message: 'Enter the markdown file name',
    default: 'content.mdx',
  },
  {
    type: 'input',
    name: 'difficulty',
    message: 'Enter the difficulty of the post',
    choices: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner',
    when: (answers) => answers.type === 'tutorial',
  },
];

generateInfoFile();
