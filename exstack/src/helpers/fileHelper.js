const fileHelper = {
    getExtentionFromFileName: (fileName) => {
        const fragments = fileName.split('.');
        if (fragments.length == 1) {
            return "";
        } else {
            return fragments[fragments.length - 1];
        }
    },
    splitFileName: (fileName) => {
        if (typeof fileName !== 'string' && !(fileName instanceof String)) {
            throw new TypeError(`type '${typeof fileName}' cannot be assigned to type 'string'`);
        }

        let dotIndex = -1;

        for (let i = fileName.length - 1; i >= 0; i--) {
            if (fileName.charAt(i) === '.') {
                dotIndex = i;
                break;
            }
        }
        
        if (dotIndex == -1) {
            return [fileName, undefined];
        }

        if (dotIndex == fileName.length - 1) {
            return [fileName.slice(0, dotIndex), undefined];
        } else {
            return [fileName.slice(0, dotIndex), fileName.slice(dotIndex + 1, fileName.length)];
        }
    }
}

module.exports = fileHelper;