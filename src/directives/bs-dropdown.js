// src/directives/bs-dropdown.js
import { Dropdown } from 'bootstrap';

export default {
  mounted(el) {
    // Nếu Bootstrap đã auto‑init trước rồi thì dùng instance đó
    const existing = Dropdown.getInstance(el);
    el._bsDropdown = existing || new Dropdown(el);
  },
  unmounted(el) {
    // Hủy instance khi element bị unmount
    if (el._bsDropdown) {
      el._bsDropdown.dispose();
      delete el._bsDropdown;
    }
  }
}