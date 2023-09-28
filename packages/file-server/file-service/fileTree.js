import fs from 'fs';

function getFileTree(path) {
  const stats = fs.statSync(path);
  if (stats.isFile()) {
    const strArr = path.split('/').pop().split('.');
    const name = strArr.slice(0, strArr.length - 1).join('.');
    const extendName = strArr[strArr.length - 1];
    return {
      name,
      extendName,
      fullPath: path,
      size: `${(stats.size / 1024).toFixed(1)}KB`,
      children: []
    };
  } else if (stats.isDirectory()) {
    const dirEntries = fs.readdirSync(path, { withFileTypes: true });
    const dirTree = {
      name: path.split('/').pop(),
      extendName: '',
      fullPath: path,
      size: '',
      children: []
    };
    for (let entry of dirEntries) {
      const childPath = `${path}/${entry.name}`;
      dirTree.children.push(getFileTree(childPath));
    }
    return dirTree;
  }
}

const fileTree = getFileTree('./resource/dark');
const jsonStr = JSON.stringify(fileTree, null, 2)

fs.writeFileSync('./resource/dark-file.json', jsonStr)
