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
        return `
            select 
                a.page_id, 
                b.content_id, 
                c.seq,
                c.seq_base,
                c.width,
                c.type,
                c.content,
                c.background,
                d.image_id,
                e.message_digest,
                e.extension
            from 
                dbibridge.page a
                inner join dbibridge.page_content b on a.page_id=b.page_id
                inner join dbibridge.content c on b.content_id=c.content_id 
                left join dbibridge.image_content d on b.content_id=d.content_id
                left join dbibridge.image e on d.image_id=e.image_id
            where
                a.page_type='ABOUTUS';
        `;
    },
    selectPageContent: (pageId) => {
        return `
            select 
                a.page_id, 
                a.content_id, 
                b.seq,
                b.seq_base,
                b.width,
                b.type,
                b.content,
                b.background,
                c.image_id,
                d.message_digest,
                d.extension
            from 
                dbibridge.page_content a 
                inner join dbibridge.content b on a.content_id=b.content_id 
                left join dbibridge.image_content c on b.content_id=c.content_id
                left join dbibridge.image d on c.image_id=d.image_id
            where
                a.page_id=${pageId}
        `;
    },
    createPageContentTransactionCreateContent: (seq, seqBase, width, type, content, background) => {
        const eContent = sqlStringEscape(content);
        return `
            insert into dbibridge.content (seq, seq_base, width, type, content, background) 
            values (${seq}, ${seqBase}, '${width}', '${type}', '${eContent}', '${background}');
        `;
    },
    createPageContentTransactionCreatePageContent: (pageId, contentId) => {
        return `
            insert into dbibridge.page_content (page_id, content_id) 
            values (${pageId}, ${contentId});
        `;
    },
    createPageContentTransactionCreateImageContent: (imageId, contentId) => {
        return `
            insert into dbibridge.image_content (image_id, content_id) 
            values (${imageId}, ${contentId});
        `;
    },
    updatePageContent: (pageId, seq, seqBase, type, width, content, imageId, background) => {        
        const eContent = sqlStringEscape(content);

        if (type === 'IMAGE' && imageId) {
            return `
                update 
                    dbibridge.page_content a 
                    inner join dbibridge.content b on a.content_id=b.content_id 
                    left join dbibridge.image_content c on b.content_id=c.content_id 
                set 
                    b.width='${width}', 
                    b.type='${type}', 
                    b.content='${eContent}', 
                    b.background='${background}', 
                    c.image_id=${imageId} 
                where 
                    a.page_id=${pageId} and b.seq=${seq} and b.seq_base=${seqBase};
            `;
        } else {
            return `
                update 
                    dbibridge.page_content a 
                    inner join dbibridge.content b on a.content_id=b.content_id 
                set 
                    b.width='${width}', 
                    b.type='${type}', 
                    b.content='${eContent}', 
                    b.background='${background}' 
                where 
                    a.page_id=${pageId} and b.seq=${seq} and b.seq_base=${seqBase};
            `;
        }
    },
    deletePageContent: (pageId, seq, seqBase) => {
        return `
            delete
                a, b, c
            from 
                dbibridge.page_content a
                inner join dbibridge.content b on a.content_id=b.content_id 
                left join dbibridge.image_content c on b.content_id=c.content_id
            where 
                a.page_id=${pageId} and b.seq=${seq} and b.seq_base=${seqBase};
        `;
    },
    selectCourse: () => {
        return `
            select 
                a.page_id, d.seq, d.seq_base, a.name, c.*
            from
                dbibridge.page a 
                inner join dbibridge.course_image b on a.page_id=b.page_id
                inner join dbibridge.image c on b.image_id=c.image_id
                inner join dbibridge.course d on a.page_id=d.page_id;
        `;
    },
    selectCourseInfo: (courseId) => {
        return `
            select 
                a.page_id, a.name, a.page_type, b.seq, b.seq_base, b.description1, b.description2, 
                b.field_title1, b.field_title2, b.field_title3, b.field_title4, b.field_title5, b.field_title6,
                b.field1, b.field2, b.field3, b.field4, b.field5, b.field6, b.registerUrl,
                d.message_digest, d.file_name, d.extension
            from 
                dbibridge.page a
                inner join dbibridge.course b on a.page_id=b.page_id
                inner join dbibridge.page_image c on a.page_id=c.page_id
                inner join dbibridge.image d on c.image_id=d.image_id
            where 
                a.page_id=${courseId};
        `;
    },
    createCourseTransactionCreatePage: (name) => {
        const eName = sqlStringEscape(name);
        return `
            insert into dbibridge.page (name, page_type)
            values ('${eName}', 'COURSE')
        `;
    },
    createCourseTransactionCreateCourse: (pageId, description1, description2, seq, seqBase, registerUrl,
        fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6,
        field1, field2, field3, field4, field5, field6) => {
        
        const eDescription1 = sqlStringEscape(description1);
        const eDescription2 = sqlStringEscape(description2);
        const eRegisterUrl = sqlStringEscape(registerUrl);
        const eFieldTitle1 = sqlStringEscape(fieldTitle1);
        const eFieldTitle2 = sqlStringEscape(fieldTitle2);
        const eFieldTitle3 = sqlStringEscape(fieldTitle3);
        const eFieldTitle4 = sqlStringEscape(fieldTitle4);
        const eFieldTitle5 = sqlStringEscape(fieldTitle5);
        const eFieldTitle6 = sqlStringEscape(fieldTitle6);
        const eField1 = sqlStringEscape(field1);
        const eField2 = sqlStringEscape(field2);
        const eField3 = sqlStringEscape(field3);
        const eField4 = sqlStringEscape(field4);
        const eField5 = sqlStringEscape(field5);
        const eField6 = sqlStringEscape(field6);

        return `
            insert into dbibridge.course (page_id, description1, description2, field_title1, field_title2, field_title3, field_title4, field_title5, field_title6, field1, field2, field3, field4, field5, field6, register_url, seq, seq_base)
            values (${pageId}, '${eDescription1}', '${eDescription2}', '${eFieldTitle1}', '${eFieldTitle2}', '${eFieldTitle3}', '${eFieldTitle4}', '${eFieldTitle5}', '${eFieldTitle6}', '${eField1}', '${eField2}', '${eField3}', '${eField4}', '${eField5}', '${eField6}', '${eRegisterUrl}', ${seq}, ${seqBase});
        `;
    },
    createCourseTransactionCreateCourseImage: (pageId, thumbImageId) => {
        return `
            insert into dbibridge.course_image (page_id, image_id)
            values (${pageId}, ${thumbImageId});
        `;
    },
    createCourseTransactionCreatePageImage: (pageId, pageImageId) => {
        return `
            insert into dbibridge.page_image (page_id, image_id)
            values (${pageId}, ${pageImageId});
        `;
    },
    updateCourse: (pageId, name, description1, description2, seq, seqBase, registerUrl,
        fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6,
        field1, field2, field3, field4, field5, field6, pageImageId, thumbImageId) => {
        
        const eName = sqlStringEscape(name);
        const eDescription1 = sqlStringEscape(description1);
        const eDescription2 = sqlStringEscape(description2);
        const eRegisterUrl = sqlStringEscape(registerUrl);
        const eFieldTitle1 = sqlStringEscape(fieldTitle1);
        const eFieldTitle2 = sqlStringEscape(fieldTitle2);
        const eFieldTitle3 = sqlStringEscape(fieldTitle3);
        const eFieldTitle4 = sqlStringEscape(fieldTitle4);
        const eFieldTitle5 = sqlStringEscape(fieldTitle5);
        const eFieldTitle6 = sqlStringEscape(fieldTitle6);
        const eField1 = sqlStringEscape(field1);
        const eField2 = sqlStringEscape(field2);
        const eField3 = sqlStringEscape(field3);
        const eField4 = sqlStringEscape(field4);
        const eField5 = sqlStringEscape(field5);
        const eField6 = sqlStringEscape(field6);

        return `
            update
                dbibridge.page a
                inner join dbibridge.course b on a.page_id=b.page_id
                inner join dbibridge.page_image c on a.page_id=c.page_id
                inner join dbibridge.course_image d on a.page_id=d.page_id
            set
                a.name='${eName}',
                b.description1='${eDescription1}',
                b.description2='${eDescription2}',
                b.field_title1='${eFieldTitle1}',
                b.field_title2='${eFieldTitle2}',
                b.field_title3='${eFieldTitle3}',
                b.field_title4='${eFieldTitle4}',
                b.field_title5='${eFieldTitle5}',
                b.field_title6='${eFieldTitle6}',
                b.field1='${eField1}',
                b.field2='${eField2}',
                b.field3='${eField3}',
                b.field4='${eField4}',
                b.field5='${eField5}',
                b.field6='${eField6}',
                b.register_url='${eRegisterUrl}',
                b.seq=${seq},
                b.seq_base=${seqBase},
                c.image_id=${pageImageId},
                d.image_id=${thumbImageId}
            where 
                a.page_id=${pageId};
        `;
    },
    deleteCourse: (pageId) => {
        return `
            delete
                a, b, c
            from 
                dbibridge.page a
                inner join dbibridge.course b on a.page_id=b.page_id 
                inner join dbibridge.page_image c on a.page_id=c.page_id
                inner join dbibridge.course_image d on a.page_id=d.page_id
            where 
                a.page_id=${pageId};
        `;
    }
}

module.exports = query;