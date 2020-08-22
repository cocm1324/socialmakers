const expect = require('chai').expect;
const sequence = require('../src/helpers/seqHelper');

const testSeqSeqBaseObjectArray1 = [
    {
        objectId: 1,
        seq: 1,
        seqBase: 1
    },
    {
        objectId: 2,
        seq: 3,
        seqBase: 1
    },
    {
        objectId: 3,
        seq: 4,
        seqBase: 2
    },
    {
        objectId: 4,
        seq: 4,
        seqBase: 1
    },
    {
        objectId: 5,
        seq: 8,
        seqBase: 3
    },
    {
        objectId: 6,
        seq: 6,
        seqBase: 1
    },
    {
        objectId: 7,
        seq: 7,
        seqBase: 1
    },
    {
        objectId: 8,
        seq: 8,
        seqBase: 1
    },
    {
        objectId: 9,
        seq: 17,
        seqBase: 2
    },
    {
        objectId: 10,
        seq: 25,
        seqBase: 3
    },
    {
        objectId: 11,
        seq: 9,
        seqBase: 1
    }
];

const testSeqSeqBaseObjectArray2 = [

]

const testSeqSeqBaseObjectArray3 = [
    {
        objectId: 1,
        seq: 3,
        seqBase: 2
    },
    {
        objectId: 9,
        seq: 17,
        seqBase: 2
    }
]

describe('Sequence Helper Tests', () => {
    describe('getNextSeq Test', () => {

        it('should equal seq = 9, seqBase = 1', () => {
            const result = sequence.getNextSeq(testSeqSeqBaseObjectArray1);
            expect(result).to.eql({seq: 10, seqBase: 1});
        });

        it('should equal seq = 1, seqBase = 1', () => {
            const result = sequence.getNextSeq(testSeqSeqBaseObjectArray2);
            expect(result).to.eql({seq: 1, seqBase: 1});
        });
    
    });

    describe('decrementSeq Test', () => {

        it('should equal undefined', () => {
            const result = sequence.decrementSeq(1, testSeqSeqBaseObjectArray2);
            expect(result).to.eql(undefined);
        });

        it('should equal undefined', () => {
            const result = sequence.decrementSeq(1, testSeqSeqBaseObjectArray3);
            expect(result).to.eql(undefined);
        });

        it('should equal seq = 1, seqBase = 1', () => {
            const result = sequence.decrementSeq(9, testSeqSeqBaseObjectArray3);
            expect(result).to.eql({seq: 1, seqBase: 1});
        });

        it('should equal seq = 5, seqBase = 1', () => {
            const result = sequence.decrementSeq(7, testSeqSeqBaseObjectArray1);
            expect(result).to.eql({seq: 5, seqBase: 1});
        });

        it('should equal seq = 1, seqBase = 2', () => {
            const result = sequence.decrementSeq(3, testSeqSeqBaseObjectArray1);
            expect(result).to.eql({seq: 1, seqBase: 2});
        });

        it('should equal seq = 42, seqBase = 5', () => {
            const result = sequence.decrementSeq(11, testSeqSeqBaseObjectArray1);
            expect(result).to.eql({seq: 42, seqBase: 5});
        });
    });

    describe('incrementSeq Test', () => {

        it('should equal undefined', () => {
            const result = sequence.incrementSeq(1, testSeqSeqBaseObjectArray2);
            expect(result).to.eql(undefined);
        });

        it('should equal undefined', () => {
            const result = sequence.incrementSeq(11, testSeqSeqBaseObjectArray1);
            expect(result).to.eql(undefined);
        });

        it('should equal seq = 15, seqBase = 2', () => {
            const result = sequence.incrementSeq(6, testSeqSeqBaseObjectArray1);
            expect(result).to.eql({seq: 15, seqBase: 2});
        });

        it('should equal seq = 5, seqBase = 1', () => {
            const result = sequence.incrementSeq(2, testSeqSeqBaseObjectArray1);
            expect(result).to.eql({seq: 5, seqBase: 1});
        });

        it('should equal seq = 10, seqBase = 1', () => {
            const result = sequence.incrementSeq(9, testSeqSeqBaseObjectArray1);
            expect(result).to.eql({seq: 10, seqBase: 1});
        });

        it('should equal seq = 9, seqBase = 1', () => {
            const result = sequence.incrementSeq(1, testSeqSeqBaseObjectArray3);
            expect(result).to.eql({seq: 9, seqBase: 1});
        });
    });
});