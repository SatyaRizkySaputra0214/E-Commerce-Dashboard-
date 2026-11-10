import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { Product } from '#shared/types/api';
import AppButton from './AppButton.vue';
import AppIcon from './AppIcon.vue';
import AppModal from './AppModal.vue';
import ProductFormModal from './ProductFormModal.vue';

const existingProduct: Product = {
  id: 5,
  name: 'Jalan Canvas Tote',
  category: 'Accessories',
  price: 189000,
  stock: 40,
};

describe('ProductFormModal', () => {
  it('renders "Add product" and empty inputs when product is null', () => {
    const wrapper = mount(ProductFormModal, {
      props: {
        open: true,
        product: null,
        categories: ['Accessories', 'Apparel'],
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        components: { AppModal, AppButton, AppIcon },
      },
      attachTo: document.body,
    });

    expect(document.body.textContent).toContain('Add product');
    const nameInput = document.body.querySelector<HTMLInputElement>('#product-name');
    const categoryInput = document.body.querySelector<HTMLInputElement>('#product-category');
    const priceInput = document.body.querySelector<HTMLInputElement>('#product-price');
    const stockInput = document.body.querySelector<HTMLInputElement>('#product-stock');

    expect(nameInput?.value).toBe('');
    expect(categoryInput?.value).toBe('');
    expect(priceInput?.value).toBe('');
    expect(stockInput?.value).toBe('');

    wrapper.unmount();
  });

  it('renders "Edit product" and pre-filled inputs when product is provided', () => {
    const wrapper = mount(ProductFormModal, {
      props: {
        open: true,
        product: existingProduct,
        categories: ['Accessories', 'Apparel'],
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        components: { AppModal, AppButton, AppIcon },
      },
      attachTo: document.body,
    });

    expect(document.body.textContent).toContain('Edit product');
    const nameInput = document.body.querySelector<HTMLInputElement>('#product-name');
    const categoryInput = document.body.querySelector<HTMLInputElement>('#product-category');
    const priceInput = document.body.querySelector<HTMLInputElement>('#product-price');
    const stockInput = document.body.querySelector<HTMLInputElement>('#product-stock');

    expect(nameInput?.value).toBe('Jalan Canvas Tote');
    expect(categoryInput?.value).toBe('Accessories');
    expect(priceInput?.value).toBe('189000');
    expect(stockInput?.value).toBe('40');

    wrapper.unmount();
  });

  it('displays client validation errors when submitting an empty form', async () => {
    const wrapper = mount(ProductFormModal, {
      props: {
        open: true,
        product: null,
        categories: ['Accessories'],
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        components: { AppModal, AppButton, AppIcon },
      },
      attachTo: document.body,
    });

    const form = document.body.querySelector<HTMLFormElement>('form');
    form?.dispatchEvent(new Event('submit', { cancelable: true }));
    await wrapper.vm.$nextTick();

    expect(document.body.textContent).toContain('Product name is required.');
    expect(document.body.textContent).toContain('Category is required.');
    expect(document.body.textContent).toContain('Price is required.');
    expect(document.body.textContent).toContain('Stock is required.');

    wrapper.unmount();
  });

  it('emits close when Cancel button is clicked', async () => {
    const wrapper = mount(ProductFormModal, {
      props: {
        open: true,
        product: null,
        categories: [],
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        components: { AppModal, AppButton, AppIcon },
      },
      attachTo: document.body,
    });

    const buttons = Array.from(document.body.querySelectorAll('button'));
    const cancelButton = buttons.find((btn) => btn.textContent?.includes('Cancel'));
    cancelButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('close')).toBeTruthy();
    wrapper.unmount();
  });
});
