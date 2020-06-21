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
    },

    createUser: (login, password, role) => {
        return `
            insert into dbibridge.user
                (login, password, role)
            values
                ('${login}', '${password}', '${role}')
            ;
        `;
    },
    selectUser: (login) => {
        return `select * from dbibridge.user where login='${login}';`;
    }
}

module.exports = query;