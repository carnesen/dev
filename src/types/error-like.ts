import { z } from 'zod';
export const errorLikeSchema = z.object({
	message: z.string(),
	stack: z.string(),
	code: z.string().optional().nullable(),
});

export type ErrorLike = z.infer<typeof errorLikeSchema>;
