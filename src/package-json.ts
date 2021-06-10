import * as z from 'zod';

export const packageJsonSchema = z
	.object({
		name: z.string(),
		description: z.string(),
		private: z.boolean().optional(),
		version: z.string(),
	})
	.nonstrict();

export type PackageJson = z.infer<typeof packageJsonSchema>;
