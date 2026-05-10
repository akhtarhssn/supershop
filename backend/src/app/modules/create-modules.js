/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs/promises');
const path = require('path');

// Define the file extensions
const extensions = [
  'interface.ts',
  'model.ts',
  'validation.ts',
  'controller.ts',
  'service.ts',
  'route.ts',
];

// Function to create files in a folder
async function createFiles(folder) {
  // Loop through each extension and create the corresponding file
  for (const extension of extensions) {
    await fs.writeFile(
      path.join(__dirname, `${folder}/${folder.toLowerCase()}.${extension}`),
      '',
    );
  }
}

// Define the folder name
const folders = ['Category', 'Store', 'Product', 'Order', 'Review', 'Dashboard'];

async function main() {
  for (const folder of folders) {
    try {
      await fs.mkdir(path.join(__dirname, folder));
      await createFiles(folder);
      console.log(`Created files for folder ${folder}`);
    } catch (error) {
      console.error(
        `Error creating files for folder ${folder}: ${error.message}`,
      );
    }
  }
}

main();
