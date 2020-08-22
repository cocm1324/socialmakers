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
            INSERT INTO 
                dbibridge.image (messageDigest, originalFileName, extension) 
            VALUES 
                ('${messageDigest}', '${fileName}', '${extension}')
            ;
        `;
    },
    selectSingleImage: (id) => {
        return `
            SELECT 
                * 
            FROM 
                dbibridge.image 
            WHERE 
                imageId=${id}
            ;
        `;
    },
    selectPageImage: (pageCount, pageNo) => {
        const start = pageCount * (pageNo - 1);
        const end = pageCount * pageNo;

        return `
            SELECT 
                * 
            FROM 
                dbibridge.image 
            LIMIT 
                ${start},${end}
            ;
        `;
    },
    selectAllImage: () => {
        return `
            SELECT 
                * 
            FROM 
                dbibridge.image
            ;
        `;
    },
    deleteSingleImage: (imageId) => {
        return `
            DELETE FROM 
                dbibridge.image
            WHERE 
                imageId=${imageId}
            ;
        `;
    },

    createUser: (login, password, role) => {
        const active = 1;

        return `
            INSERT INTO 
                dbibridge.user (login, password, role, active)
            VALUES
                ('${login}', '${password}', ${role}, ${active})
            ;
        `;
    },
    selectUser: (login) => {
        return `
            SELECT 
                * 
            FROM 
                dbibridge.user 
            WHERE 
                login='${login}'
            ;
        `;
    },

    selectPageAboutUs: () => {
        const aboutUs = 0;
        return `
            SELECT 
                a.pageId, a.pageName, 
                d.bannerImageId, d.bannerMessageDigest, d.bannerExtension,
                b.contentId, b.seq, b.seqBase, b.width, b.type, b.content, b.background, 
                b.imageId, c.messageDigest, c.extension
            FROM 
                dbibridge.page a
                LEFT JOIN dbibridge.pageContent b ON a.pageId=b.pageId
                INNER JOIN dbibridge.image c ON b.imageId=c.imageId
                CROSS JOIN (
                    SELECT 
                        d2.imageId AS bannerImageId, 
                        d2.messageDigest AS bannerMessageDigest, 
                        d2.extension AS bannerExtension
                    FROM 
                        dbibridge.configuration d1 
                        INNER JOIN dbibridge.image d2 ON d1.aboutUsBannerImageId=d2.imageId
                ) d
            WHERE
                a.pageType=${aboutUs}
            ;
        `;
    },
    updatePageAboutUs: (pageName, bannerImageId) => {
        const aboutUs = 0;
        return `
            UPDATE 
                dbibridge.page a
                CROSS JOIN dbibridge.configuration b
            SET
                a.pageName='${pageName}',
                b.aboutUsBannerImageId=${bannerImageId}
            WHERE
                a.pageType=${aboutUs}
            ;
        `;
    },
    selectPageContent: (pageId) => {
        return `
            SELECT 
                a.pageId, a.contentId, a.seq, a.seqBase, 
                a.width, a.type, a.content, a.background, 
                b.imageId, b.messageDigest, b.extension
            FROM 
                dbibridge.pageContent a
                INNER JOIN dbibridge.image b ON a.imageId=b.imageId
            WHERE
                a.pageId=${pageId}
            ;
        `;
    },
    selectPageContentObjectIdSeqSeqBase: (pageId) => {
        return `
            SELECT 
                contentId AS objectId, seq, seqBase 
            FROM 
                dbibridge.pageContent
            WHERE
                pageId = ${pageId}
            ;
        `;
    },
    createPageContent: (pageId, seq, seqBase, width, type, content, background, imageId) => {
        const dbContent = content ? sqlStringEscape(content) : '';
        const dbBackground = background ? background : '#FFFFFF';
        const dbImageId = imageId ? imageId : 'null';

        return `
            INSERT INTO 
                dbibridge.pageContent (pageId, seq, seqBase, width, type, content, background, imageId) 
            VALUES 
                (${pageId}, ${seq}, ${seqBase}, ${width}, ${type} , '${dbContent}', '${dbBackground}', ${dbImageId})
            ;
        `;
    },
    updatePageContent: (pageId, contentId, type, width, content, imageId, background) => {        
        const dbContent = content ? sqlStringEscape(content) : "";
        const dbBackground = background ? background : '#FFFFFF';
        const dbImageId = imageId ? imageId : 'null';

        return `
            UPDATE
                dbibridge.pageContent
            SET
                width=${width}, type=${type}, content='${dbContent}', background='${dbBackground}', imageId=${dbImageId}
            WHERE
                pageId=${pageId} AND contentId=${contentId}
            ;
        `;
    },
    deletePageContent: (pageId, contentId) => {
        return `
            DELETE FROM 
                dbibridge.pageContent
            WHERE
                pageId=${pageId} AND contentId=${contentId}
            ;
        `;
    },
    updatePageContentSeq: (pageId, contentId, seq, seqBase) => {
        return `
            UPDATE
                dbibridge.pageContent
            SET
                seq=${seq}, seqBase=${seqBase}
            WHERE
                pageId=${pageId} AND contentId=${contentId}
            ;
        `;
    },
    selectCourse: () => {
        return `
            SELECT
                a.pageId, a.pageName, b.seq, b.seqBase, b.published, c.imageId, c.messageDigest, c.extension
            FROM
                dbibridge.page a
                INNER JOIN dbibridge.courseInfo b ON a.pageId=b.courseId
                INNER JOIN dbibridge.image c ON b.thumbnailimageId=c.imageId
            ;
        `;
    },
    selectCourseInfo: (courseId) => {
        const course = 1;
        return `
            SELECT
                b.courseId, a.pageName as courseName, b.seq, b.seqBase,
                c.imageId AS thumbnailImageId, c.messageDigest AS thumbnailMessageDigest, c.extension AS thumbnailExtension,
                d.imageId AS bannerImageId, d.messageDigest AS bannerMessageDigest, d.extension AS bannerExtension,
                a.pageName, b.description1, b.description2, b.fieldTitle1, b.fieldTitle2, b.fieldTitle3, b.fieldTitle4, b.fieldTitle5, b.fieldTitle6,
                b.field1, b.field2, b.field3, b.field4, b.field5, b.field6, b.registerUrl
            FROM
                dbibridge.page a
                INNER JOIN dbibridge.courseInfo b ON a.pageId=b.courseId
                INNER JOIN dbibridge.image c ON b.thumbnailImageId=c.imageId
                INNER JOIN dbibridge.image d ON b.bannerImageId=d.imageId
            WHERE 
                a.pageId=${courseId} AND a.pageType=${course}
            ;
        `;
    },
    selectCourseObjectIdSeqSeqBase: () => {
        return `
            SELECT 
                courseId as objectId, seq, seqBase 
            FROM 
                dbibridge.courseInfo
            ;
        `;
    },
    createCourseTransactionCreatePage: (pageName) => {
        const course = 1;
        const dbPageName = sqlStringEscape(pageName);

        return `
            INSERT INTO 
                dbibridge.page (pageName, pageType)
            VALUES 
                ('${dbPageName}', ${course})
            ;
        `;
    },
    createCourseTransactionCreateCourseInfo: (
        courseId, thumbImageId, bannderImageId, description1, description2, seq, seqBase, registerUrl,
        fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6,
        field1, field2, field3, field4, field5, field6
    ) => {
        const dbDescription1 = description1 ? sqlStringEscape(description1) : 'null';
        const dbDescription2 = description2 ? sqlStringEscape(description2) : 'null';
        const dbRegisterUrl = sqlStringEscape(registerUrl);
        const dbFieldTitle1 = fieldTitle1 ? sqlStringEscape(fieldTitle1) : 'null';
        const dbFieldTitle2 = fieldTitle2 ? sqlStringEscape(fieldTitle2) : 'null';
        const dbFieldTitle3 = fieldTitle3 ? sqlStringEscape(fieldTitle3) : 'null';
        const dbFieldTitle4 = fieldTitle4 ? sqlStringEscape(fieldTitle4) : 'null';
        const dbFieldTitle5 = fieldTitle5 ? sqlStringEscape(fieldTitle5) : 'null';
        const dbFieldTitle6 = fieldTitle6 ? sqlStringEscape(fieldTitle6) : 'null';
        const dbField1 = field1 ? sqlStringEscape(field1) : 'null';
        const dbField2 = field2 ? sqlStringEscape(field2) : 'null';
        const dbField3 = field3 ? sqlStringEscape(field3) : 'null';
        const dbField4 = field4 ? sqlStringEscape(field4) : 'null';
        const dbField5 = field5 ? sqlStringEscape(field5) : 'null';
        const dbField6 = field6 ? sqlStringEscape(field6) : 'null';

        return `
            INSERT INTO 
                dbibridge.courseInfo (
                    courseId, thumbnailImageId, bannerImageId, description1, description2, 
                    fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
                    field1, field2, field3, field4, field5, field6, registerUrl, seq, seqBase
                )
            VALUES
                (
                    ${courseId}, ${thumbImageId}, ${bannderImageId}, '${dbDescription1}', '${dbDescription2}',
                    '${dbFieldTitle1}', '${dbFieldTitle2}', '${dbFieldTitle3}', '${dbFieldTitle4}', '${dbFieldTitle5}', '${dbFieldTitle6}',
                    '${dbField1}', '${dbField2}', '${dbField3}', '${dbField4}', '${dbField5}', '${dbField6}', '${dbRegisterUrl}', ${seq}, ${seqBase}
                )
            ;
        `;
    },
    updateCourse: (pageId, name, description1, description2, registerUrl,
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
                c.image_id=${pageImageId},
                d.image_id=${thumbImageId}
            where 
                a.page_id=${pageId};
        `;
    },
    deleteCourse: (pageId) => {
        const course = 1;
        return `
            DELETE
                a, b
            FROM
                dbibridge.page a
                INNER JOIN dbibridge.courseInfo b ON a.pageId=b.courseId 
            WHERE 
                a.pageId=${pageId} AND a.pageId=${course}
            ;
        `;
    },
    updateCourseSeq: (courseId, seq, seqBase) => {
        return `
            UPDATE
                dbibridge.courseInfo
            SET
                seq=${seq}, seqBase=${seqBase}
            WHERE
                courseId=${courseId}
            ;
        `;
    }
}

module.exports = query;