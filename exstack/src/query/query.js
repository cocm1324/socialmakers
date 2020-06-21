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
    },

    selectPageAboutUs: () => {
        return `select * from dbibridge.page where page_type='ABOUTUS' limit 1;`;
    },
    selectPageContent: (pageId) => {
        return `
            select 
                a.page_id, 
                a.content_id, 
                b.seq, 
                b.width, 
                b.type, 
                b.content, 
                c.image_id, 
                d.message_digest, 
                d.extension
            from 
                (select * from dbibridge.page_content where page_id=1) a 
                inner join dbibridge.content b on a.content_id=b.content_id 
                left join dbibridge.image_content c on b.content_id=c.content_id
                left join dbibridge.image d on c.image_id=d.image_id
            ;
        `;
    }
}

module.exports = query;