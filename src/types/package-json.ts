import * as z from 'zod';

export const packageJsonSchema = z
	.object({
		description: z.string(),
		name: z.string(),
		private: z.boolean().optional(),
		scripts: z.record(z.string()).optional(),
		version: z.string(),
	})
	.passthrough();

export type PackageJson = z.infer<typeof packageJsonSchema>;
