import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { getFilePath } from '../apis'

export const useFileTreeStore = defineStore('fileTree', {
  state: () => {
    return {
      fileTree: {},
      currentNode: {},
      pathStack: []
    }
  },
  actions: {
    async initFileTree() {
      const fileTree = await getFilePath()
      if(fileTree?.name === 'dark') {
        this.fileTree = fileTree
        if(fileTree?.children?.length) {
          this.pathStack = [ fileTree.name ]
          this.currentNode = fileTree
        }
      }
      return fileTree
    }
  }
})