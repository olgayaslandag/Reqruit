jQuery(document).ready(function($) {
    let counter = 0;

    const elementTypes = [
        { value: 'text', label: 'Metin' },
        { value: 'number', label: 'Sayı' },
        { value: 'file', label: 'Dosya' },
        { value: 'textarea', label: 'Metin Alanı' },
        { value: 'select', label: 'Seçim Kutusu' },
        { value: 'checkbox', label: 'Onay Kutuları' }
    ];

    // Eleman Ekleme
    $('#add-element').on('click', function() {
        counter++;
        const id = `element-${counter}`;

        const elementHtml = `
            <div class="dd-form-element" data-id="${id}" style="border:1px solid #ddd; padding:10px; margin-bottom:10px; background:#fff;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong>Eleman #${counter}</strong>
                    <button type="button" class="button-link-delete remove-element">Kaldır</button>
                </div>

                <label>Etiket (Label):</label>
                <input type="text" class="element-label regular-text" placeholder="Örn: Adınız" />

                <label>Alan Adı (name):</label>
                <input type="text" class="element-name regular-text" placeholder="örn: name" />

                <label>Tür (Type):</label>
                <select class="element-type">
                    ${elementTypes.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
                </select>

                <label>
                    <input type="checkbox" class="element-required" /> Zorunlu alan
                </label>

                <div class="extra-options" style="display:none; margin-top:10px;">
                    <label>Seçenekler (virgülle ayırın):</label>
                    <input type="text" class="element-options regular-text" placeholder="Örn: Evet, Hayır" />
                </div>
            </div>
        `;

        $('#form-elements').append(elementHtml);
    });

    // Tür değiştiğinde seçenek alanını göster/gizle
    $(document).on('change', '.element-type', function() {
        const type = $(this).val();
        const container = $(this).closest('.dd-form-element');
        if (type === 'select' || type === 'checkbox') {
            container.find('.extra-options').slideDown();
        } else {
            container.find('.extra-options').slideUp();
        }
    });

    // Eleman kaldırma
    $(document).on('click', '.remove-element', function() {
        $(this).closest('.dd-form-element').remove();
        renderOutput();
    });

    // Değişiklikleri dinle
    $(document).on('input change', '.dd-form-element input, .dd-form-element select', renderOutput);

    // JSON çıktısı üret
    function renderOutput() {
        const elements = [];

        $('.dd-form-element').each(function() {
            const el = $(this);
            const type = el.find('.element-type').val();
            const options = el.find('.element-options').val();

            elements.push({
                label: el.find('.element-label').val(),
                name: el.find('.element-name').val(),
                type,
                required: el.find('.element-required').is(':checked'),
                options: (type === 'select' || type === 'checkbox') ? options.split(',').map(o => o.trim()).filter(Boolean) : []
            });
        });

        $('#output').text(JSON.stringify(elements, null, 2));
    }
});