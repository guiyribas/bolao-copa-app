import { toast as sonnerToast } from 'sonner';
import { ApiError } from '@/lib/api';

export const toast = sonnerToast;

export function showErrorToast(error: unknown, fallbackMessage = 'Algo deu errado. Tente de novo.') {
  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : fallbackMessage;
  sonnerToast.error(message);
}
