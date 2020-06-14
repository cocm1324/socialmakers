const messageDigestHelper = {
    messageDigestWithTimeStamp: (messageObject, digits) => {
        const digestLength = digits;
        const hexMax = 16;
        const padding = '0';
        const randomString = 'Hello there, I\'m currently making this md algorithm to use as uid in file in server'; 
        const timestamp = (new Date()).valueOf();        
        const digest = new Array(digestLength).fill(0)
        let digestMessage = '';

        let messageSum = JSON.stringify(messageObject) + randomString + timestamp;
        messageSum = messageSum.slice(messageSum.length / 3, messageSum.length - 1) + messageSum.slice(0, messageSum.length / 3);
        messageSum += padding.repeat(digestLength - messageSum.length % digestLength);
        messageSum = messageSum.slice(messageSum.length / 3, messageSum.length - 1) + messageSum.slice(0, messageSum.length / 3);

        for (let i = 0; i < messageSum.length; i++) {
            digest[i % digestLength] += messageSum.charCodeAt(i);
        }
        for (let i = 0; i < digest.length; i++) {
            digest[i] += timestamp;
            digest[i] %= hexMax;
            if (0 <= digest[i] && digest[i] < 10) {
                digestMessage += digest[i].toString();
            } else if (10 <= digest[i] && digest[i] < 16) {
                digestMessage += String.fromCharCode(55 + digest[i]);
            }
        }

        return digestMessage;
    }
}

module.exports = messageDigestHelper;
