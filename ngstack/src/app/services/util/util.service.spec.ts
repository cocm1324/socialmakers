import { TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: UtilService = TestBed.get(UtilService);
		expect(service).toBeTruthy();
	});
	
	describe('dbDateTimeStringToUserReadable() Test', () => {
		const curDateTime = new Date();
		const testCase1 = new Date(curDateTime.valueOf() - 10000);
		const testCase2 = new Date(curDateTime.valueOf() - 60001);

		it('should return ', () => {
			const service: UtilService = TestBed.get(UtilService);
			expect(service.dbDateTimeStringToUserReadable(testCase1.toDateString())).toBe('조금 전');
		});
	});
});
