(function() {
    'use strict';

    var ReqruitWidget = (function() {
        var defaults = {
            container: '#reqruit-widget',
            baseUrl: '',
            department: null,
            theme: {
                primaryColor: '#4f46e5',
                primaryHover: '#4338ca',
                borderRadius: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                bgColor: '#f9fafb',
                cardBg: '#ffffff',
                textColor: '#111827',
                borderColor: '#e5e7eb',
                errorColor: '#dc2626',
                successColor: '#16a34a'
            }
        };

        var config = {};
        var container = null;
        var state = {
            currentDepartmentId: null,
            departments: [],
            breadcrumb: [],
            form: null,
            loading: false,
            error: null
        };

        function init(options) {
            config = deepMerge({}, defaults, options);
            
            function initWidget() {
                container = typeof config.container === 'string' 
                    ? document.querySelector(config.container) 
                    : config.container;

                if (!container) {
                    console.error('ReqruitWidget: Container not found');
                    return;
                }

                injectStyles();
                
                // Önce init parametresindeki department'i kontrol et, yoksa URL'den al
                var deptSlug = config.department;
                if (!deptSlug) {
                    var urlParams = new URLSearchParams(window.location.search);
                    deptSlug = urlParams.get('department');
                }
                
                if (deptSlug) {
                    loadDepartmentBySlug(deptSlug);
                } else {
                    loadRootDepartments();
                }
            }
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initWidget);
            } else {
                initWidget();
            }
        }

        function deepMerge(target) {
            var sources = Array.prototype.slice.call(arguments, 1);
            sources.forEach(function(source) {
                if (source) {
                    Object.keys(source).forEach(function(key) {
                        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                            target[key] = target[key] || {};
                            deepMerge(target[key], source[key]);
                        } else {
                            target[key] = source[key];
                        }
                    });
                }
            });
            return target;
        }

        function injectStyles() {
            var styleId = 'reqruit-widget-styles';
            if (document.getElementById(styleId)) return;

            var t = config.theme;
            var css = `
                .reqruit-widget {
                    --reqruit-primary: ${t.primaryColor};
                    --reqruit-primary-hover: ${t.primaryHover};
                    --reqruit-border-radius: ${t.borderRadius};
                    --reqruit-font-family: ${t.fontFamily};
                    --reqruit-bg: ${t.bgColor};
                    --reqruit-card-bg: ${t.cardBg};
                    --reqruit-text: ${t.textColor};
                    --reqruit-border: ${t.borderColor};
                    --reqruit-error: ${t.errorColor};
                    --reqruit-success: ${t.successColor};
                    font-family: var(--reqruit-font-family);
                    background: var(--reqruit-bg);
                    padding: 20px;
                    border-radius: var(--reqruit-border-radius);
                }
                .reqruit-widget * {
                    box-sizing: border-box;
                }
                .reqruit-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }
                .reqruit-breadcrumb-item {
                    color: var(--reqruit-primary);
                    cursor: pointer;
                    font-size: 14px;
                    background: none;
                    border: none;
                    padding: 0;
                }
                .reqruit-breadcrumb-item:hover {
                    text-decoration: underline;
                }
                .reqruit-breadcrumb-separator {
                    color: #9ca3af;
                }
                .reqruit-breadcrumb-current {
                    color: var(--reqruit-text);
                    font-size: 14px;
                    font-weight: 500;
                }
                .reqruit-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: var(--reqruit-text);
                    margin: 0 0 8px 0;
                }
                .reqruit-subtitle {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 0 0 24px 0;
                }
                .reqruit-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                }
                .reqruit-card {
                    background: var(--reqruit-card-bg);
                    border: 1px solid var(--reqruit-border);
                    border-radius: var(--reqruit-border-radius);
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                }
                .reqruit-card:hover {
                    border-color: var(--reqruit-primary);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
                .reqruit-card-icon {
                    width: 48px;
                    height: 48px;
                    margin: 0 auto 12px;
                    background: var(--reqruit-bg);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .reqruit-card-icon svg {
                    width: 24px;
                    height: 24px;
                    color: var(--reqruit-primary);
                }
                .reqruit-card-title {
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--reqruit-text);
                    margin: 0;
                }
                .reqruit-form {
                    background: var(--reqruit-card-bg);
                    border-radius: var(--reqruit-border-radius);
                    padding: 24px;
                }
                .reqruit-form-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: var(--reqruit-text);
                    margin: 0 0 8px 0;
                }
                .reqruit-form-description {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 0 0 24px 0;
                }
                .reqruit-field {
                    margin-bottom: 20px;
                }
                .reqruit-label {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--reqruit-text);
                    margin-bottom: 6px;
                }
                .reqruit-label-required {
                    color: var(--reqruit-error);
                    margin-left: 4px;
                }
                .reqruit-input,
                .reqruit-select,
                .reqruit-textarea {
                    width: 100%;
                    padding: 10px 12px;
                    font-size: 14px;
                    font-family: inherit;
                    border: 1px solid var(--reqruit-border);
                    border-radius: var(--reqruit-border-radius);
                    background: var(--reqruit-card-bg);
                    color: var(--reqruit-text);
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .reqruit-input:focus,
                .reqruit-select:focus,
                .reqruit-textarea:focus {
                    outline: none;
                    border-color: var(--reqruit-primary);
                    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
                }
                .reqruit-textarea {
                    min-height: 100px;
                    resize: vertical;
                }
                .reqruit-error-msg {
                    color: var(--reqruit-error);
                    font-size: 12px;
                    margin-top: 4px;
                }
                .reqruit-checkbox-group,
                .reqruit-radio-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .reqruit-checkbox-label,
                .reqruit-radio-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-size: 14px;
                }
                .reqruit-checkbox,
                .reqruit-radio {
                    width: 16px;
                    height: 16px;
                    accent-color: var(--reqruit-primary);
                }
                .reqruit-file-input {
                    font-size: 14px;
                }
                .reqruit-file-hint {
                    font-size: 12px;
                    color: #6b7280;
                    margin-top: 4px;
                }
                .reqruit-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px 24px;
                    font-size: 14px;
                    font-weight: 500;
                    font-family: inherit;
                    color: #fff;
                    background: var(--reqruit-primary);
                    border: none;
                    border-radius: var(--reqruit-border-radius);
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .reqruit-btn:hover {
                    background: var(--reqruit-primary-hover);
                }
                .reqruit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .reqruit-btn-secondary {
                    background: transparent;
                    color: var(--reqruit-text);
                    border: 1px solid var(--reqruit-border);
                }
                .reqruit-btn-secondary:hover {
                    background: var(--reqruit-bg);
                }
                .reqruit-success {
                    text-align: center;
                    padding: 40px 20px;
                }
                .reqruit-success-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 24px;
                    background: var(--reqruit-success);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .reqruit-success-icon svg {
                    width: 40px;
                    height: 40px;
                    color: #fff;
                }
                .reqruit-success-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: var(--reqruit-text);
                    margin: 0 0 8px 0;
                }
                .reqruit-success-text {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 0 0 16px 0;
                }
                .reqruit-reference {
                    display: inline-block;
                    background: var(--reqruit-bg);
                    padding: 12px 24px;
                    border-radius: var(--reqruit-border-radius);
                    font-family: monospace;
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--reqruit-text);
                }
                .reqruit-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 60px;
                }
                .reqruit-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid var(--reqruit-border);
                    border-top-color: var(--reqruit-primary);
                    border-radius: 50%;
                    animation: reqruit-spin 0.8s linear infinite;
                }
                @keyframes reqruit-spin {
                    to { transform: rotate(360deg); }
                }
                .reqruit-widget-wrapper {
                    position: relative;
                }
                .reqruit-widget-loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    border-radius: var(--reqruit-border-radius);
                }
                .reqruit-widget-loading-overlay .reqruit-spinner {
                    width: 48px;
                    height: 48px;
                    border-width: 4px;
                }
                .reqruit-error-container {
                    background: #fef2f2;
                    border: 1px solid var(--reqruit-error);
                    border-radius: var(--reqruit-border-radius);
                    padding: 16px;
                    color: var(--reqruit-error);
                    text-align: center;
                }
            `;

            var style = document.createElement('style');
            style.id = styleId;
            style.textContent = css;
            document.head.appendChild(style);
        }

        function apiRequest(endpoint, options) {
            options = options || {};
            var url = config.baseUrl.replace(/\/$/, '') + '/api/widget' + endpoint;

            return fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                ...options
            }).then(function(response) {
                return response.json();
            });
        }

        function loadRootDepartments() {
            state.loading = true;
            state.breadcrumb = [];
            state.form = null;  // Form temizlenmeli
            render();

            apiRequest('/departments')
                .then(function(response) {
                    if (response.success) {
                        state.departments = response.data;
                        state.error = null;
                    } else {
                        state.error = response.message || 'Departmanlar yüklenemedi.';
                    }
                })
                .catch(function(err) {
                    state.error = 'Bağlantı hatası. Lütfen tekrar deneyin.';
                })
                .finally(function() {
                    state.loading = false;
                    render();
                });
        }

        function updateUrl(slug) {
            if (slug) {
                var url = new URL(window.location.href);
                url.searchParams.set('department', slug);
                window.history.replaceState({ slug: slug }, '', url.toString());
            }
        }

        function clearUrl() {
            var url = new URL(window.location.href);
            url.searchParams.delete('department');
            window.history.replaceState({}, '', url.toString());
        }

        function loadDepartment(id) {
            state.loading = true;
            render();

            apiRequest('/departments/' + id)
                .then(function(response) {
                    if (response.success) {
                        var dept = response.data;
                        if (dept.has_children) {
                            state.departments = dept.children;
                            state.breadcrumb.push({
                                id: id,
                                title: dept.title,
                                slug: dept.slug
                            });
                            state.form = null;
                            updateUrl(dept.slug);
                        } else if (dept.has_form && dept.form) {
                            state.form = dept.form;
                            state.breadcrumb.push({
                                id: id,
                                title: dept.title,
                                slug: dept.slug
                            });
                            state.departments = [];
                            updateUrl(dept.slug);
                        }
                        state.error = null;
                    } else {
                        state.error = response.message || 'Departman yüklenemedi.';
                    }
                })
                .catch(function() {
                    state.error = 'Bağlantı hatası. Lütfen tekrar deneyin.';
                })
                .finally(function() {
                    state.loading = false;
                    render();
                });
        }

        function loadDepartmentBySlug(slug) {
            state.loading = true;
            state.breadcrumb = [];
            render();

            apiRequest('/departments/slug/' + encodeURIComponent(slug))
                .then(function(response) {
                    if (response.success) {
                        var dept = response.data;
                        if (dept.has_children) {
                            state.departments = dept.children;
                            state.breadcrumb.push({
                                id: dept.id,
                                title: dept.title,
                                slug: dept.slug
                            });
                            state.form = null;
                            updateUrl(dept.slug);
                        } else if (dept.has_form && dept.form) {
                            state.form = dept.form;
                            state.breadcrumb.push({
                                id: dept.id,
                                title: dept.title,
                                slug: dept.slug
                            });
                            state.departments = [];
                            updateUrl(dept.slug);
                        }
                        state.error = null;
                    } else {
                        state.error = response.message || 'Departman yüklenemedi.';
                    }
                })
                .catch(function() {
                    state.error = 'Bağlantı hatası. Lütfen tekrar deneyin.';
                })
                .finally(function() {
                    state.loading = false;
                    render();
                });
        }

        function navigateToBreadcrumb(index) {
            if (index === -1) {
                loadRootDepartments();
                clearUrl();
            } else {
                state.breadcrumb = state.breadcrumb.slice(0, index);
                var item = state.breadcrumb[index];
                if (item.slug) {
                    loadDepartmentBySlug(item.slug);
                } else {
                    loadDepartment(item.id);
                }
            }
        }

        function render() {
            if (!container) return;

            var html = '<div class="reqruit-widget-wrapper">';

            if (state.loading) {
                html += '<div class="reqruit-widget-loading-overlay"><div class="reqruit-spinner"></div></div>';
            } else if (state.error) {
                html += renderError();
            } else if (state.form) {
                html += renderForm();
            } else {
                html += renderDepartments();
            }
            
            html += '</div>';
            container.innerHTML = html;
            attachEventListeners();
        }

        function renderLoading() {
            return '';
        }

        function renderError() {
            return `
                <div class="reqruit-error-container">
                    <p>${state.error}</p>
                    <button class="reqruit-btn reqruit-btn-secondary" onclick="window.ReqruitWidget.retry()" style="margin-top: 12px;">
                        Tekrar Dene
                    </button>
                </div>
            `;
        }

        function renderDepartments() {
            var html = '';

            if (state.breadcrumb.length > 0) {
                html += '<div class="reqruit-breadcrumb">';
                html += '<button type="button" class="reqruit-breadcrumb-item" data-breadcrumb="-1">Departmanlar</button>';
                state.breadcrumb.forEach(function(item, index) {
                    html += '<span class="reqruit-breadcrumb-separator">›</span>';
                    if (index === state.breadcrumb.length - 1) {
                        html += '<span class="reqruit-breadcrumb-current">' + escapeHtml(item.title) + '</span>';
                    } else {
                        html += '<button class="reqruit-breadcrumb-item" data-breadcrumb="' + index + '">' + escapeHtml(item.title) + '</button>';
                    }
                });
                html += '</div>';
            }

            html += '<h2 class="reqruit-title">Departman Seçin</h2>';
            html += '<p class="reqruit-subtitle">Başvuru yapmak istediğiniz departmanı seçin.</p>';

            if (state.departments.length > 0) {
                html += '<div class="reqruit-grid">';
                state.departments.forEach(function(dept) {
                    html += `
                        <div class="reqruit-card" data-department="${dept.id}">
                            <div class="reqruit-card-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    ${dept.has_children 
                                        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>'
                                        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'}
                                </svg>
                            </div>
                            <h3 class="reqruit-card-title">${escapeHtml(dept.title)}</h3>
                        </div>
                    `;
                });
                html += '</div>';
            } else {
                html += '<p class="reqruit-subtitle">Bu departmanda alt departman veya form bulunamadı.</p>';
            }

            return html;
        }

        function renderForm() {
            var form = state.form;
            var html = '';

            if (state.breadcrumb.length > 0) {
                html += '<div class="reqruit-breadcrumb">';
                html += '<button type="button" class="reqruit-breadcrumb-item" data-breadcrumb="-1">Departmanlar</button>';
                state.breadcrumb.forEach(function(item, index) {
                    html += '<span class="reqruit-breadcrumb-separator">›</span>';
                    if (index === state.breadcrumb.length - 1) {
                        html += '<span class="reqruit-breadcrumb-current">' + escapeHtml(item.title) + '</span>';
                    } else {
                        html += '<button class="reqruit-breadcrumb-item" data-breadcrumb="' + index + '">' + escapeHtml(item.title) + '</button>';
                    }
                });
                html += '</div>';
            }

            html += '<div class="reqruit-form">';
            html += '<h2 class="reqruit-form-title">' + escapeHtml(form.name) + '</h2>';
            if (form.description) {
                html += '<p class="reqruit-form-description">' + escapeHtml(form.description) + '</p>';
            }

            html += '<form id="reqruit-form-submit" enctype="multipart/form-data">';

            form.fields.forEach(function(field) {
                html += renderField(field);
            });

            html += '<button type="submit" class="reqruit-btn" style="width: 100%;">Başvuruyu Gönder</button>';
            html += '</form>';
            html += '</div>';

            return html;
        }

        function renderField(field) {
            var html = '<div class="reqruit-field">';
            html += '<label class="reqruit-label">' + escapeHtml(field.label);
            if (field.required) {
                html += '<span class="reqruit-label-required">*</span>';
            }
            html += '</label>';

            switch (field.type) {
                case 'text':
                case 'email':
                case 'tel':
                case 'number':
                case 'date':
                    html += `<input type="${field.type}" name="${escapeHtml(field.name)}" class="reqruit-input" ${field.required ? 'required' : ''}>`;
                    break;

                case 'textarea':
                    html += `<textarea name="${escapeHtml(field.name)}" class="reqruit-textarea" ${field.required ? 'required' : ''}></textarea>`;
                    break;

                case 'select':
                    html += `<select name="${escapeHtml(field.name)}" class="reqruit-select" ${field.required ? 'required' : ''}>`;
                    html += '<option value="">Seçiniz</option>';
                    if (field.options) {
                        field.options.forEach(function(opt) {
                            html += `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`;
                        });
                    }
                    html += '</select>';
                    break;

                case 'checkbox':
                    html += '<div class="reqruit-checkbox-group">';
                    if (field.options) {
                        field.options.forEach(function(opt) {
                            html += `
                                <label class="reqruit-checkbox-label">
                                    <input type="checkbox" name="${escapeHtml(field.name)}" value="${escapeHtml(opt)}" class="reqruit-checkbox">
                                    ${escapeHtml(opt)}
                                </label>
                            `;
                        });
                    }
                    html += '</div>';
                    break;

                case 'radio':
                    html += '<div class="reqruit-radio-group">';
                    if (field.options) {
                        field.options.forEach(function(opt) {
                            html += `
                                <label class="reqruit-radio-label">
                                    <input type="radio" name="${escapeHtml(field.name)}" value="${escapeHtml(opt)}" class="reqruit-radio" ${field.required ? 'required' : ''}>
                                    ${escapeHtml(opt)}
                                </label>
                            `;
                        });
                    }
                    html += '</div>';
                    break;

                case 'file':
                    html += `<input type="file" name="${escapeHtml(field.name)}" class="reqruit-file-input" ${field.required ? 'required' : ''}>`;
                    if (field.options && field.options.length > 0) {
                        html += `<p class="reqruit-file-hint">İzin verilen: ${escapeHtml(field.options.join(', '))}</p>`;
                    }
                    break;
            }

            html += '</div>';
            return html;
        }

        function renderSuccess(referenceNo) {
            return `
                <div class="reqruit-success">
                    <div class="reqruit-success-icon">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <h2 class="reqruit-success-title">Başvurunuz Alındı!</h2>
                    <p class="reqruit-success-text">Başvurunuz başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</p>
                    <div class="reqruit-reference">${escapeHtml(referenceNo)}</div>
                    <button class="reqruit-btn reqruit-btn-secondary" onclick="window.ReqruitWidget.reset()" style="margin-top: 24px;">
                        Yeni Başvuru Yap
                    </button>
                </div>
            `;
        }

        function attachEventListeners() {
            var breadcrumbItems = container.querySelectorAll('[data-breadcrumb]');
            breadcrumbItems.forEach(function(item) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    var index = parseInt(this.getAttribute('data-breadcrumb'));
                    navigateToBreadcrumb(index);
                });
            });

            var cards = container.querySelectorAll('[data-department]');
            cards.forEach(function(card) {
                card.addEventListener('click', function() {
                    var id = parseInt(this.getAttribute('data-department'));
                    loadDepartment(id);
                });
            });

            var form = container.querySelector('#reqruit-form-submit');
            if (form) {
                form.addEventListener('submit', handleFormSubmit);
            }
        }

        function handleFormSubmit(e) {
            e.preventDefault();

            var formEl = e.target;
            var formData = new FormData(formEl);
            var labels = {};

            state.form.fields.forEach(function(field) {
                labels[field.name] = field.label;
            });
            formData.append('labels', JSON.stringify(labels));

            var submitBtn = formEl.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Gönderiliyor...';

            var url = config.baseUrl.replace(/\/$/, '') + '/api/widget/forms/' + state.form.slug + '/submit';

            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(response) {
                if (response.success) {
                    container.innerHTML = '<div class="reqruit-widget">' + renderSuccess(response.data.reference_no) + '</div>';
                } else {
                    showFormErrors(formEl, response.errors || { _general: [response.message] });
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Başvuruyu Gönder';
                }
            })
            .catch(function() {
                showFormErrors(formEl, { _general: ['Bağlantı hatası. Lütfen tekrar deneyin.'] });
                submitBtn.disabled = false;
                submitBtn.textContent = 'Başvuruyu Gönder';
            });
        }

        function showFormErrors(formEl, errors) {
            var existingErrors = formEl.querySelectorAll('.reqruit-error-msg');
            existingErrors.forEach(function(el) { el.remove(); });

            Object.keys(errors).forEach(function(field) {
                var input = formEl.querySelector('[name="' + field + '"]');
                if (input) {
                    var errorDiv = document.createElement('p');
                    errorDiv.className = 'reqruit-error-msg';
                    errorDiv.textContent = errors[field].join(', ');
                    input.parentNode.appendChild(errorDiv);
                }
            });
        }

        function escapeHtml(str) {
            if (str == null) return '';
            var div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        function retry() {
            if (state.breadcrumb.length > 0) {
                var lastItem = state.breadcrumb[state.breadcrumb.length - 1];
                if (lastItem.slug) {
                    loadDepartmentBySlug(lastItem.slug);
                } else {
                    loadDepartment(lastItem.id);
                }
            } else {
                loadRootDepartments();
            }
        }

        function reset() {
            state.currentDepartmentId = null;
            state.departments = [];
            state.breadcrumb = [];
            state.form = null;
            state.loading = false;
            state.error = null;
            loadRootDepartments();
        }

        return {
            init: init,
            retry: retry,
            reset: reset
        };
    })();

    if (typeof window !== 'undefined') {
        window.ReqruitWidget = ReqruitWidget;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ReqruitWidget;
    }
})();