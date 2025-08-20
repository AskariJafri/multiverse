import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAppStore = create(
  devtools((set) => ({
    modals: {},
    toasts: [],
    isLoading: false,
    dialog: null,

    actions: {
      openModal: (modalId, modalProps = {}) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [modalId]: { isOpen: true, props: modalProps },
          },
        })),

      closeModal: (modalId) =>
        set((state) => {
          const newModals = { ...state.modals };
          delete newModals[modalId];
          return { modals: newModals };
        }),

      setLoading: (value) => set({ isLoading: value }),

      addToast: (toast) =>
        set((state) => ({
          toasts: [...state.toasts, { id: Date.now(), ...toast }],
        })),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      openDialog: (dialog) => set({ dialog }),
      closeDialog: () => set({ dialog: null }),
    },
  }))
);