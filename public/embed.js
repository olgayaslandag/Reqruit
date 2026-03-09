/**
 * Reqruit Embed Script
 * WordPress sitelerine form embed etmek için kullanılır
 * 
 * Kullanım:
 * <div id="reqruit-form" data-slug="form-slug"></div>
 * <script src="https://yourdomain.com/embed.js"></script>
 */

(function() {
    'use strict';

    const API_URL = window.REQRUIT_API_URL || '';
    
    function init() {
        const containers = document.querySelectorAll('[data-reqruit-form]');
        
        containers.forEach(function(container) {
            const slug = container.dataset.slug;
            if (slug) {
                loadForm(container, slug);
            }
        });
    }

    function loadForm(container, slug) {
        const apiUrl = API_URL + '/api/public/forms/' + slug;
        
        fetch(apiUrl)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Form yüklenemedi');
                }
                return response.json();
            })
            .then(function(form) {
                renderForm(container, form);
            })
            .catch(function(error) {
                container.innerHTML = '<p class="reqruit-error">Form yüklenirken hata oluştu.</p>';
                console.error('Reqruit Error:', error);
            });
    }

    function renderForm(container, form) {
        const wrapper = document.createElement('div');
        wrapper.className = 'reqruit-form-wrapper';
        
        // Header
        const header = document.createElement('div');
        header.className = 'reqruit-form-header';
        header.innerHTML = '<h2>' + escapeHtml(form.name) + '</h2>';
        if (form.description) {
            header.innerHTML += '<p>' + escapeHtml(form.description) + '</p>';
        }
        wrapper.appendChild(header);
        
        // Form
        const formEl = document.createElement('form');
        formEl.className = 'reqruit-form';
        formEl.dataset.slug = form.slug;
        
        // Add CSRF token
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = getCsrfToken();
        formEl.appendChild(csrfInput);
        
        // Labels
        const labelsInput = document.createElement('input');
        labelsInput.type = 'hidden';
        labelsInput.name = 'labels';
        labelsInput.value = JSON.stringify(getFieldLabels(form.fields));
        formEl.appendChild(labelsInput);
        
        // Fields
        form.fields.forEach(function(field) {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'reqruit-field reqruit-field-' + field.type;
            
            const label = document.createElement('label');
            label.innerHTML = escapeHtml(field.label) + (field.required ? ' <span class="reqruit-required">*</span>' : '');
            label.htmlFor = 'reqruit-' + field.name;
            fieldWrapper.appendChild(label);
            
            const input = createFieldInput(field);
            fieldWrapper.appendChild(input);
            
            formEl.appendChild(fieldWrapper);
        });
        
        // Submit button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'reqruit-submit';
        submitBtn.textContent = 'Gönder';
        formEl.appendChild(submitBtn);
        
        // Success message container
        const successEl = document.createElement('div');
        successEl.className = 'reqruit-success';
        successEl.style.display = 'none';
        
        wrapper.appendChild(formEl);
        wrapper.appendChild(successEl);
        container.appendChild(wrapper);
        
        // Form submit handler
        formEl.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm(formEl, form.slug, successEl);
        });
    }

    function createFieldInput(field) {
        const input = document.createElement('input');
        input.id = 'reqruit-' + field.name;
        input.name = field.name;
        input.required = field.required;
        input.className = 'reqruit-input';
        
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'number':
            case 'date':
                input.type = field.type;
                break;
                
            case 'textarea':
                const textarea = document.createElement('textarea');
                textarea.id = 'reqruit-' + field.name;
                textarea.name = field.name;
                textarea.required = field.required;
                textarea.className = 'reqruit-input reqruit-textarea';
                textarea.rows = 4;
                return textarea;
                
            case 'select':
                const select = document.createElement('select');
                select.id = 'reqruit-' + field.name;
                select.name = field.name;
                select.required = field.required;
                select.className = 'reqruit-input reqruit-select';
                
                const defaultOpt = document.createElement('option');
                defaultOpt.value = '';
                defaultOpt.textContent = 'Seçiniz';
                select.appendChild(defaultOpt);
                
                (field.options || []).forEach(function(opt) {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    select.appendChild(option);
                });
                return select;
                
            case 'checkbox':
            case 'radio':
                const group = document.createElement('div');
                group.className = 'reqruit-' + field.type + '-group';
                (field.options || []).forEach(function(opt) {
                    const label = document.createElement('label');
                    label.className = 'reqruit-' + field.type + '-label';
                    
                    const radioInput = document.createElement('input');
                    radioInput.type = field.type;
                    radioInput.name = field.name;
                    radioInput.value = opt;
                    radioInput.required = field.required && field.options.indexOf(opt) === 0;
                    radioInput.className = 'reqruit-input';
                    
                    label.appendChild(radioInput);
                    label.appendChild(document.createTextNode(' ' + opt));
                    group.appendChild(label);
                });
                return group;
                
            case 'file':
                input.type = 'file';
                input.accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg';
                break;
                
            default:
                input.type = 'text';
        }
        
        return input;
    }

    function getFieldLabels(fields) {
        const labels = {};
        fields.forEach(function(field) {
            labels[field.name] = field.label;
        });
        return labels;
    }

    function getCsrfToken() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.content : '';
    }

    function submitForm(form, slug, successEl) {
        const submitBtn = form.querySelector('.reqruit-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        
        fetch(API_URL + '/api/public/forms/' + slug + '/submit', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            form.style.display = 'none';
            successEl.style.display = 'block';
            successEl.innerHTML = '<div class="reqruit-success-content">' +
                '<div class="reqruit-success-icon">✓</div>' +
                '<h3>Başvurunuz Alındı!</h3>' +
                (data.reference_no ? '<p>Referans No: <strong>' + data.reference_no + '</strong></p>' : '') +
                '<p>En kısa sürede size dönüş yapacağız.</p>' +
            '</div>';
        })
        .catch(function(error) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            alert('Başvuru gönderilirken hata oluştu. Lütfen tekrar deneyin.');
            console.error('Submit Error:', error);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
