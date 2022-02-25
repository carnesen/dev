import { LocalToday } from '../local-today';
import { runBackground } from '../run-background';

describe(LocalToday.name, () => {
	it('Generates a YYYY-MM-DD timestamp', async () => {
		const localToday = LocalToday();
		expect(localToday).toMatch(/\d\d\d\d-\d\d-\d\d/);
		const alsoLocalToday = runBackground('date', { args: ['+%F'] });
		expect(localToday).toBe(alsoLocalToday);
	});
});
