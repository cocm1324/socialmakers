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
    selectPageImage: (pageCount, pageNo, increment) => {
        const start = pageCount * (pageNo - 1);
        const order = increment ? "" : "ORDER BY imageId DESC";

        return `
            SELECT 
                a.*, b.*
            FROM 
                dbibridge.image a
                CROSS JOIN (SELECT COUNT(*) as rowCount FROM dbibridge.image) b
            ${order}
            LIMIT 
                ${start}, ${pageCount}
            ;
        `;
    },
    selectAllImage: (increment) => {
        if (increment) {
            return `
                SELECT 
                    * 
                FROM 
                    dbibridge.image
                ;
            `;
        } else {
            return `
                SELECT 
                    * 
                FROM 
                    dbibridge.image
                ORDER BY
                    imageId DESC
                ;
            `;
        }
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
    updateUser: (login, password, role) => {
        const active = 1;

        return `
            UPDATE
                dbibridge.user
            SET
                password='${password}',
                role=${role},
                active=${active}
            WHERE
                login='${login}'
            ;
        `;
    },
    deleteUser: (login) => {
        return `
            DELETE FROM
                dbibridge.user
            WHERE
                login='${login}'
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
                d.bannerImageBlur, d.bannerColor,
                b.contentId, b.seq, b.seqBase, b.width, b.type, b.content, b.background, 
                b.imageId, c.messageDigest, c.extension
            FROM 
                dbibridge.page a
                LEFT JOIN dbibridge.pageContent b ON a.pageId=b.pageId
                LEFT JOIN dbibridge.image c ON b.imageId=c.imageId
                CROSS JOIN (
                    SELECT 
                        d1.aboutUsBannerImageBlur AS bannerImageBlur,
                        d1.aboutUsBannerColor As bannerColor,
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
    updatePageAboutUs: (pageName, bannerImageId, bannerImageBlur, bannerColor) => {
        const aboutUs = 0;
        const dbBannerColor = bannerColor ? `'${bannerColor}'` : 'NULL';

        return `
            UPDATE 
                dbibridge.page a
                CROSS JOIN dbibridge.configuration b
            SET
                a.pageName='${pageName}',
                b.aboutUsBannerImageId=${bannerImageId},
                b.aboutUsBannerImageBlur=${bannerImageBlur},
                b.aboutUsBannerColor=${dbBannerColor}
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
                LEFT JOIN dbibridge.image b ON a.imageId=b.imageId
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
                b.courseId, a.pageName as courseName, b.seq, b.seqBase, b.bannerColor, b.bannerImageBlur,
                c.imageId AS thumbImageId, c.messageDigest AS thumbMessageDigest, c.extension AS thumbExtension,
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
        courseId, thumbImageId, bannderImageId, bannerImageBlur, bannerColor, 
        description1, description2, seq, seqBase, registerUrl,
        fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6,
        field1, field2, field3, field4, field5, field6
    ) => {
        const defalutImageId = 1;

        const dbBannerImageId = bannderImageId ? bannderImageId : defalutImageId;
        const dbBannerImageBlur = bannerImageBlur ? bannerImageBlur : 20;
        const dbBannerColor = bannerColor ? `'${bannerColor}'` : 'NULL';

        const dbDescription1 = description1 ? sqlStringEscape(description1) : 'NULL';
        const dbDescription2 = description2 ? sqlStringEscape(description2) : 'NULL';
        const dbRegisterUrl = sqlStringEscape(registerUrl);
        const dbFieldTitle1 = fieldTitle1 ? sqlStringEscape(fieldTitle1) : 'NULL';
        const dbFieldTitle2 = fieldTitle2 ? sqlStringEscape(fieldTitle2) : 'NULL';
        const dbFieldTitle3 = fieldTitle3 ? sqlStringEscape(fieldTitle3) : 'NULL';
        const dbFieldTitle4 = fieldTitle4 ? sqlStringEscape(fieldTitle4) : 'NULL';
        const dbFieldTitle5 = fieldTitle5 ? sqlStringEscape(fieldTitle5) : 'NULL';
        const dbFieldTitle6 = fieldTitle6 ? sqlStringEscape(fieldTitle6) : 'NULL';
        const dbField1 = field1 ? sqlStringEscape(field1) : 'NULL';
        const dbField2 = field2 ? sqlStringEscape(field2) : 'NULL';
        const dbField3 = field3 ? sqlStringEscape(field3) : 'NULL';
        const dbField4 = field4 ? sqlStringEscape(field4) : 'NULL';
        const dbField5 = field5 ? sqlStringEscape(field5) : 'NULL';
        const dbField6 = field6 ? sqlStringEscape(field6) : 'NULL';

        return `
            INSERT INTO 
                dbibridge.courseInfo (
                    courseId, thumbnailImageId, bannerImageId, bannerImageBlur, bannerColor, description1, description2, 
                    fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6, 
                    field1, field2, field3, field4, field5, field6, registerUrl, seq, seqBase
                )
            VALUES
                (
                    ${courseId}, ${thumbImageId}, ${dbBannerImageId}, ${dbBannerImageBlur}, ${dbBannerColor}, '${dbDescription1}', '${dbDescription2}',
                    '${dbFieldTitle1}', '${dbFieldTitle2}', '${dbFieldTitle3}', '${dbFieldTitle4}', '${dbFieldTitle5}', '${dbFieldTitle6}',
                    '${dbField1}', '${dbField2}', '${dbField3}', '${dbField4}', '${dbField5}', '${dbField6}', '${dbRegisterUrl}', ${seq}, ${seqBase}
                )
            ;
        `;
    },
    updateCourse: (
        pageId, courseName, thumbImageId, bannerImageId, bannerImageBlur, bannerColor, 
        description1, description2, registerUrl,
        fieldTitle1, fieldTitle2, fieldTitle3, fieldTitle4, fieldTitle5, fieldTitle6,
        field1, field2, field3, field4, field5, field6
    ) => {
        const defalutImageId = 1;

        const dbPageName = sqlStringEscape(courseName);

        const dbBannerImageId = bannerImageId ? bannerImageId : defalutImageId;
        const dbBannerImageBlur = bannerImageBlur ? bannerImageBlur : 20;
        const dbBannerColor = bannerColor ? `'${bannerColor}'` : 'NULL';

        const dbDescription1 = description1 ? sqlStringEscape(description1) : 'NULL';
        const dbDescription2 = description2 ? sqlStringEscape(description2) : 'NULL';
        const dbRegisterUrl = sqlStringEscape(registerUrl);
        const dbFieldTitle1 = fieldTitle1 ? sqlStringEscape(fieldTitle1) : 'NULL';
        const dbFieldTitle2 = fieldTitle2 ? sqlStringEscape(fieldTitle2) : 'NULL';
        const dbFieldTitle3 = fieldTitle3 ? sqlStringEscape(fieldTitle3) : 'NULL';
        const dbFieldTitle4 = fieldTitle4 ? sqlStringEscape(fieldTitle4) : 'NULL';
        const dbFieldTitle5 = fieldTitle5 ? sqlStringEscape(fieldTitle5) : 'NULL';
        const dbFieldTitle6 = fieldTitle6 ? sqlStringEscape(fieldTitle6) : 'NULL';
        const dbField1 = field1 ? sqlStringEscape(field1) : 'NULL';
        const dbField2 = field2 ? sqlStringEscape(field2) : 'NULL';
        const dbField3 = field3 ? sqlStringEscape(field3) : 'NULL';
        const dbField4 = field4 ? sqlStringEscape(field4) : 'NULL';
        const dbField5 = field5 ? sqlStringEscape(field5) : 'NULL';
        const dbField6 = field6 ? sqlStringEscape(field6) : 'NULL';

        return `
            UPDATE
                dbibridge.page a
                INNER JOIN dbibridge.courseInfo b ON a.pageId=b.courseId
            SET
                a.pageName='${dbPageName}',
                b.thumbnailImageId=${thumbImageId},
                b.bannerImageId=${dbBannerImageId},
                b.bannerImageBlur=${dbBannerImageBlur},
                b.bannerColor=${dbBannerColor},
                b.description1='${dbDescription1}',
                b.description2='${dbDescription2}',
                b.fieldTitle1='${dbFieldTitle1}',
                b.fieldTitle2='${dbFieldTitle2}',
                b.fieldTitle3='${dbFieldTitle3}',
                b.fieldTitle4='${dbFieldTitle4}',
                b.fieldTitle5='${dbFieldTitle5}',
                b.fieldTitle6='${dbFieldTitle6}',
                b.field1='${dbField1}',
                b.field2='${dbField2}',
                b.field3='${dbField3}',
                b.field4='${dbField4}',
                b.field5='${dbField5}',
                b.field6='${dbField6}',
                b.registerUrl='${dbRegisterUrl}'
            WHERE
                a.pageId=${pageId};
        `;
    },
    deleteCourse: (pageId) => {
        return `
            DELETE
                a, b, c
            FROM
                dbibridge.page a
                INNER JOIN dbibridge.courseInfo b ON a.pageId=b.courseId 
                LEFT JOIN dbibridge.pageContent c ON a.pageId=c.pageId
            WHERE 
                a.pageId=${pageId}
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
    },
    selectPageNotice: (pageCount, pageNo, increment) => {
        const start = pageCount * (pageNo - 1);
        const order = increment ? "" : "ORDER BY creationDateTime DESC";

        return `
            SELECT
                b.noticeId, a.pageName AS noticeName, c.rowCount,
                b.creationDateTime, b.updateDateTime, b.featured, b.published
            FROM
                dbibridge.page a
                INNER JOIN dbibridge.noticeInfo b ON a.pageId=b.noticeId
                CROSS JOIN (SELECT COUNT(*) as rowCount FROM dbibridge.noticeInfo) c
            ${order}
            LIMIT
                ${start}, ${pageCount}
            ;
        `;
    },
    selectNoticeInfo: (noticeId) => {
        return `
            SELECT
                b.noticeId, a.pageName AS noticeName,
                b.bannerImageId, c.messageDigest AS bannerMessageDigest, c.extension AS bannerExtension, 
                b.bannerImageBlur, b.bannerColor,
                b.creationDateTime, b.updateDateTime, b.published, b.featured
            FROM
                dbibridge.page a
                INNER JOIN dbibridge.noticeInfo b ON a.pageId=b.noticeId
                LEFT JOIN dbibridge.image c ON b.bannerImageId=c.imageId
            WHERE
                b.noticeId=${noticeId}
            ;
        `;
    },
    createNoticeTransactionCreatePage: (pageName) => {
        const notice = 2;
        const dbPageName = sqlStringEscape(pageName);

        return `
            INSERT INTO 
                dbibridge.page (pageName, pageType)
            VALUES 
                ('${dbPageName}', ${notice})
            ;
        `;
    },
    createNoticeTransactionCreateNoticeInfo: (pageId, bannerImageId, bannerImageBlur, bannerColor) => {
        const defalutImageId = 1;
        const defaultFeatured = 0;
        const defaultPublished = 1;

        const dbBannerImageId = bannerImageId ? bannerImageId : defalutImageId;
        const dbBannerImageBlur = bannerImageBlur ? bannerImageBlur : 20;
        const dbBannerColor = bannerColor ? `'${bannerColor}'` : 'NULL';

        return `
            INSERT INTO
                dbibridge.noticeInfo (
                    noticeId, bannerImageId, bannerImageBlur, bannerColor, 
                    creationDateTime, updateDateTime, featured, published
                )
            VALUES
                (
                    ${pageId}, ${dbBannerImageId}, ${dbBannerImageBlur}, ${dbBannerColor},
                    NOW(), NOW(), ${defaultFeatured}, ${defaultPublished}
                )
            ;
        `;
    },
    updateNoticeInfo: (noticeId, noticeName, bannerImageId, bannerImageBlur, bannerColor) => {
        const dbNoticeName = noticeName ? sqlStringEscape(noticeName) : 'Default';
        const dbBannerImageId = bannerImageId ? bannerImageId : defalutImageId;
        const dbBannerImageBlur = bannerImageBlur ? bannerImageBlur : 20;
        const dbBannerColor = bannerColor ? `'${bannerColor}'` : 'NULL';

        return `
            UPDATE
                dbibridge.page a
                INNER JOIN dbibridge.noticeInfo b ON a.pageId=b.noticeId
            SET
                a.pageName='${dbNoticeName}',
                b.bannerImageId=${dbBannerImageId},
                b.bannerImageBlur=${dbBannerImageBlur},
                b.bannerColor=${dbBannerColor},
                b.updateDateTime=NOW()
            WHERE
                b.noticeId=${noticeId}
            ;
        `;
    },
    deleteNotice: (noticeId) => {
        return `
            DELETE
                a, b
            FROM
                dbibridge.page a
                INNER JOIN dbibridge.noticeInfo b ON a.pageId=b.noticeId
            WHERE
                b.noticeId=${noticeId}
            ;
        `
    }
}

module.exports = query;