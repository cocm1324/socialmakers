const query = {
    createSingleImage: (messageDigest, fileName, extension) => {
        return `
            insert into dbibridge.image 
                (message_digest, file_name, extension) 
            values 
                ('${messageDigest}', '${fileName}', '${extension}')
            ;
        `;
    },
    selectSingleImage: (id) => {
        return `select * from dbibridge.image where image_id=${id};`;
    },
    selectPageImage: (pageCount, pageNo) => {
        const start = pageCount * (pageNo - 1);
        const end = pageCount * pageNo;

        return `select * from dbibridge.image limit ${start},${end};`
    },
    selectAllImage: () => {
        return `select * from dbibridge.image;`;
    },
    deleteSingleImage: (imageId) => {
        return `delete from dbibridge.image where image_id=${imageId};`;
    }

}

module.exports = query;