export const showToast = (message, type = 'success') => {
    window.dispatchEvent(new CustomEvent('toast:show', { detail: { message, type } }));
};

export const showSuccess = (message) => showToast(message, 'success');
export const showError = (message) => showToast(message, 'error');
export const showWarning = (message) => showToast(message, 'warning');
export const showInfo = (message) => showToast(message, 'info');
