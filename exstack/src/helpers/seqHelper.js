function sortFn(a, b) {
    const baseNumberA = a.seq / a.seqBase;
    const baseNumberB = b.seq / b.seqBase;
    return baseNumberA - baseNumberB;
}

const sequence = {
    sortFn,
    getNextSeq: (seqSeqBaseObjectArray) => {
        if (!(seqSeqBaseObjectArray instanceof Array) || seqSeqBaseObjectArray.length == 0) {
            return {seq: 1, seqBase: 1};
        }

        let maxSeqSeqBaseBaseNumber = 0
        seqSeqBaseObjectArray.forEach(element => {
            const {seq, seqBase} = element;
            const baseNumber = seq / seqBase;
            maxSeqSeqBaseBaseNumber = maxSeqSeqBaseBaseNumber > baseNumber ? maxSeqSeqBaseBaseNumber : baseNumber;
        });

        if (maxSeqSeqBaseBaseNumber - Math.floor(maxSeqSeqBaseBaseNumber) > 0) {
            maxSeqSeqBaseBaseNumber = Math.ceil(maxSeqSeqBaseBaseNumber);
        } else {
            maxSeqSeqBaseBaseNumber = maxSeqSeqBaseBaseNumber + 1;
        }

        return {seq: maxSeqSeqBaseBaseNumber, seqBase: 1};
    },
    decrementSeq: (targetObjectId, objectIdSeqSeqBaseObjectArray) => {
        if (!(objectIdSeqSeqBaseObjectArray instanceof Array) || objectIdSeqSeqBaseObjectArray.length == 0) {
            return undefined;
        }

        const orderList = objectIdSeqSeqBaseObjectArray.sort(sortFn);

        let index = 0;
        for (let i = 0; i < orderList.length; i++) {
            if (orderList[i].objectId == targetObjectId) {
                index = i;
                break;
            }
        }

        if (index == 0) {
            return undefined;
        } else if (index == 1) {
            const firstObject = orderList[0];
            const firstObjectBaseNumber = firstObject.seq / firstObject.seqBase;
            const firstObjectBaseNumberFloored = Math.floor(firstObjectBaseNumber);

            if (firstObjectBaseNumber >= 1 && firstObjectBaseNumber - firstObjectBaseNumberFloored > 0) {
                return {seq: firstObjectBaseNumberFloored, seqBase: 1};
            } else {
                return {seq: firstObject.seq, seqBase: firstObject.seqBase + 1};
            }
        } else {
            const preObject = orderList[index - 1];
            const preObjectBaseNumber = preObject.seq / preObject.seqBase;
            const preObjectBaseNumberFloored = Math.floor(preObjectBaseNumber);
            const prePreObject = orderList[index - 2];
            const prePreObjectBaseNumber = prePreObject.seq / prePreObject.seqBase;

            if (preObjectBaseNumber >= 1 && preObjectBaseNumber - preObjectBaseNumberFloored > 0 && preObjectBaseNumberFloored > prePreObjectBaseNumber) {
                return {seq: preObjectBaseNumberFloored, seqBase: 1};
            } else if (preObjectBaseNumber >= 1 && preObjectBaseNumber - preObjectBaseNumberFloored == 0 && preObjectBaseNumberFloored - 1 > prePreObjectBaseNumber) {
                return {seq: preObjectBaseNumber - 1, seqBase: 1};
            } else {
                return {seq: preObject.seq + prePreObject.seq, seqBase: preObject.seqBase + prePreObject.seqBase};
            }
        }
    },
    incrementSeq: (targetObjectId, objectIdSeqSeqBaseObjectArray) => {
        if (!(objectIdSeqSeqBaseObjectArray instanceof Array) || objectIdSeqSeqBaseObjectArray.length == 0) {
            return undefined;
        }

        const orderList = objectIdSeqSeqBaseObjectArray.sort(sortFn);

        let index = 0;
        for (let i = 0; i < orderList.length; i++) {
            if (orderList[i].objectId == targetObjectId) {
                index = i;
                break;
            }
        }
        
        if (index == orderList.length - 1) {
            return undefined;
        } else if (index == orderList.length - 2) {
            const lastObject = orderList[orderList.length - 1];
            const lastObjectBaseNumber = lastObject.seq / lastObject.seqBase;
            const lastObjectBaseNumberFloored = Math.floor(lastObjectBaseNumber);

            return {seq: lastObjectBaseNumberFloored + 1, seqBase: 1};
        } else {
            const nextObject = orderList[index + 1];
            const nextObjectBaseNumber = nextObject.seq / nextObject.seqBase;
            const nextObjectBaseNumberFloored = Math.floor(nextObjectBaseNumber);
            const nextNextObject = orderList[index + 2];
            const nextNextObjectBaseNumber = nextNextObject.seq / nextNextObject.seqBase;

            if (nextObjectBaseNumber - nextObjectBaseNumberFloored > 0 && nextObjectBaseNumberFloored + 1 < nextNextObjectBaseNumber) {
                return {seq: nextObjectBaseNumberFloored + 1, seqBase: 1};
            } else if (nextObjectBaseNumber - nextObjectBaseNumberFloored == 0 && nextObjectBaseNumber + 1 < nextNextObjectBaseNumber) {
                return {seq: nextObjectBaseNumber + 1, seqBase: 1}
            } else {
                return {seq: nextObject.seq + nextNextObject.seq, seqBase: nextObject.seqBase + nextNextObject.seqBase};
            }
        }
    }
}

module.exports = sequence;