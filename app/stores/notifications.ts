import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

let nextId = 0;

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);

  function dismiss(id: number): void {
    notifications.value = notifications.value.filter((entry) => entry.id !== id);
  }

  function push(type: Notification['type'], message: string): void {
    const id = ++nextId;
    notifications.value = [...notifications.value, { id, type, message }];
    setTimeout(() => dismiss(id), 5000);
  }

  function success(message: string): void {
    push('success', message);
  }

  function error(message: string): void {
    push('error', message);
  }

  function info(message: string): void {
    push('info', message);
  }

  return { notifications, push, success, error, info, dismiss };
});
