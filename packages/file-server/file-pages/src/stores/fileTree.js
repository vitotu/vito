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
          this.pathStack = [ fileTree ]
          this.currentNode = fileTree
        }
      }
      return fileTree
    },
    pushStack(node) {
      this.pathStack.push(node)
      this.currentNode = node
    },
    popStack(){
      if(this.pathStack.length > 1) {
        this.pathStack.pop()
        this.currentNode = this.pathStack[this.pathStack.length - 1]
      }
    }
  }
})