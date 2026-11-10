import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppButton from './AppButton.vue';
import AppIcon from './AppIcon.vue';
import AppModal from './AppModal.vue';
import ConfirmDialog from './ConfirmDialog.vue';

describe('ConfirmDialog', () => {
  it('renders title and message when open', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'Delete product',
        message: 'Are you sure you want to delete this product? This action cannot be undone.',
      },
      global: {
        components: { AppModal, AppButton, AppIcon },
      },
      attachTo: document.body,
    });

    expect(document.body.textContent).toContain('Delete product');
    expect(document.body.textContent).toContain('Are you sure you want to delete this product?');
    wrapper.unmount();
  });

  it('emits cancel when Cancel button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'Delete product',
        message: 'Are you sure?',
      },
      global: {
        components: { AppModal, AppButton, AppIcon },
      },
      attachTo: document.body,
    });

    const buttons = Array.from(document.body.querySelectorAll('button'));
    const cancelButton = buttons.find((btn) => btn.textContent?.includes('Cancel'));
    expect(cancelButton).toBeDefined();

    cancelButton?.click();
    expect(wrapper.emitted('cancel')).toBeTruthy();
    wrapper.unmount();
  });

  it('emits confirm when Confirm button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'Delete product',
        message: 'Are you sure?',
        confirmLabel: 'Delete',
      },
      global: {
        components: { AppModal, AppButton, AppIcon },
      },
      attachTo: document.body,
    });

    const buttons = Array.from(document.body.querySelectorAll('button'));
    const deleteButton = buttons.find((btn) => btn.textContent?.includes('Delete'));
    expect(deleteButton).toBeDefined();

    deleteButton?.click();
    expect(wrapper.emitted('confirm')).toBeTruthy();
    wrapper.unmount();
  });

  it('disables buttons when busy is true', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        open: true,
        title: 'Delete product',
        message: 'Are you sure?',
        confirmLabel: 'Delete',
        busy: true,
      },
      global: {
        components: { AppModal, AppButton, AppIcon },
      },
      attachTo: document.body,
    });

    const buttons = Array.from(document.body.querySelectorAll('button'));
    const deleteButton = buttons.find((btn) => btn.textContent?.includes('Delete…'));
    expect(deleteButton).toBeDefined();
    expect(deleteButton?.hasAttribute('disabled')).toBe(true);
    wrapper.unmount();
  });
});
