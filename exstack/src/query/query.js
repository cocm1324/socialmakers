const sqlStringEscape = (str) => {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
            default:
                return char;
        }
    });
}

const query = {
    createSingleImage: (messageDigest, fileName, extension) => {
        return `
            insert into 
                dbibridge.image (message_digest, file_name, extension) 
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
    },
    createPageContentTransactionCreateContent: (seq, width, type, content) => {
        return `insert into dbibridge.content (seq, width, type, content) values (${seq}, '${width}', '${type}', '${sqlStringEscape(content)}');`;
    },
    createPageContentTransactionCreatePageContent: (pageId, contentId) => {
        return `insert into dbibridge.page_content (page_id, content_id) values (${pageId}, ${contentId});`;
    },
    createPageContentTransactionCreateImageContent: (imageId, contentId) => {
        return `insert into dbibridge.image_content (image_id, content_id) values (${imageId}, ${contentId});`;
    },
    updatePageContent: (pageId, seq, type, width, content, imageId) => {        
        let str = `update dbibridge.page_content a inner join dbibridge.content b on a.content_id=b.content_id `;

        if (type === 'IMAGE' && imageId) {
            str += `left join dbibridge.image_content c on b.content_id=c.content_id set b.width='${width}', b.type='${type}', b.content='${content}', c.image_id=${imageId} where a.page_id=${pageId} and b.seq=${seq};`;
        } else {
            str += `set b.width='${width}', b.type='${type}', b.content='${sqlStringEscape(content)}' where a.page_id=${pageId} and b.seq=${seq};`
        }

        return str;
    },
    deletePageContent: (pageId, seq) => {
        return `
            delete
                a, b, c
            from 
                dbibridge.page_content a
                inner join dbibridge.content b on a.content_id=b.content_id 
                left join dbibridge.image_content c on b.content_id=c.content_id
            where 
                a.page_id=${pageId} and b.seq=${seq};
        `;
    }
}

module.exports = query;