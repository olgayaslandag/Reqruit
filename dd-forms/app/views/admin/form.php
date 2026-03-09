<div class="wrap">
    <h1>IK Form Oluşturucu</h1>
    <p>Yeni form elemanları ekleyin, türlerini belirleyin ve değerlerini düzenleyin.</p>

    <form method="post" action="<?php echo admin_url("admin.php?page=dd-form-store"); ?>">
        <?php wp_nonce_field('dd-form-add'); ?>
        <?php 
            $form_id       = isset($form->id) ? intval($form->id) : '';
            $form_name     = isset($form->name) ? esc_attr($form->name) : '';
            $description   = isset($form->description) ? esc_textarea($form->description) : '';
            $department_id = isset($form->department_id) ? intval($form->department_id) : '';
            $fields_json   = isset($form->fields_json) ? $form->fields_json : '[]'; 
        ?>

        <div class="form-group">
            <?php
                wp_admin_text_input([
                    'id'    => 'name',
                    'label' => 'Form Adı',
                    'value' => old('name', $form_name ?? ''),
                ]);
            ?>
        </div>

        <div class="form-group">
            <?php
            wp_admin_textarea_input([
                'id' => 'description',
                'label' => 'Açıklama',
                'value' => $description ?? '',
                'rows' => 4,
            ]);
            ?>
        </div>

        <div class="form-group">
            <?php
            wp_admin_select_input([
                'id'           => 'department_id',
                'label'        => 'Departman Seçimi',
                'selected'     => $department_id ?? '',
                'tree'         => true,
                'options'      => $tree,
                'first_option' => 'Departman Seçiniz',
            ]);
            ?>
        </div>

        <!-- FORM BUILDER -->
        <div id="dd-form-builder">

            <div id="form-elements"></div>

            <button 
                type="button" 
                id="add-element" 
                class="button button-primary" 
                style="margin-top:15px;">
                + Yeni Eleman Ekle
            </button>

            <pre id="output" style="margin-top:20px; background:#f6f7f7; padding:10px; border:1px solid #ddd;"></pre>
        </div>

        <button class="button button-success" style="margin-top:20px;">Kaydet</button>

        <input type="hidden" name="form_fields" id="form_fields">
        <input type="hidden" name="id" value="<?php echo $form_id; ?>">
    </form>
</div>

<script>
jQuery(document).ready(function($) {

    let counter = 0;

    // Backend'den alanları al
    const existingFieldsRaw = <?php echo $fields_json ?: '[]'; ?>;
    const existingFields = Array.isArray(existingFieldsRaw) ? existingFieldsRaw : [];

    // 🔥 Şehir listesi JSON
    const CITY_LIST = [
        "Adana","Adıyaman","Afyonkarahisar","Ağrı","Amasya","Ankara","Antalya","Artvin","Aydın",
        "Balıkesir","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı",
        "Çorum","Denizli","Diyarbakır","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir",
        "Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Isparta","Mersin","İstanbul",
        "İzmir","Kars","Kastamonu","Kayseri","Kırklareli","Kırşehir","Kocaeli","Konya",
        "Kütahya","Malatya","Manisa","Kahramanmaraş","Mardin","Muğla","Muş","Nevşehir",
        "Niğde","Ordu","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Tekirdağ","Tokat",
        "Trabzon","Tunceli","Şanlıurfa","Uşak","Van","Yozgat","Zonguldak","Aksaray","Bayburt",
        "Karaman","Kırıkkale","Batman","Şırnak","Bartın","Ardahan","Iğdır","Yalova",
        "Karabük","Kilis","Osmaniye","Düzce"
    ];

    const elementTypes = [
        { value: 'text', label: 'Metin' },
        { value: 'number', label: 'Sayı' },
        { value: 'file', label: 'Dosya' },
        { value: 'textarea', label: 'Metin Alanı' },
        { value: 'select', label: 'Seçim Kutusu' },
        { value: 'checkbox', label: 'Onay Kutuları' },
        { value: 'city', label: 'Şehir Seçimi' },
        { value: 'experiences', label: 'İş Deneyimleri (Tekrarlı Alan)' },
        { value: 'date', label: 'Tarih' }
    ];

    /** ------------------------------
        LABEL → AUTO NAME (slugify)
    ----------------------------------*/

    function slugify(text) {
        return text
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '')
            .toLowerCase();
    }

    $(document).on('input', '.element-label', function () {
        const label = $(this).val();
        const slug = slugify(label);
        $(this).closest('.dd-form-element').find('.element-name').val(slug);
        renderOutput();
    });

    /** ------------------------------
        VAR OLAN FORM ALANLARINI YÜKLE
    ----------------------------------*/
    function loadExistingFields() {
        existingFields.forEach(item => {
            counter++;
            const id = `element-${counter}`;
            const optionsArray = Array.isArray(item.options) ? item.options : [];
            const optionsString = optionsArray.join(", ");

            const elementHtml = `
                <div class="dd-form-element" data-id="${id}" style="border:1px solid #ddd; padding:10px; margin-bottom:10px; background:#fff;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <strong>Eleman #${counter}</strong>
                        <button type="button" class="button-link-delete remove-element">Kaldır</button>
                    </div>

                    <label>Etiket (Label):</label>
                    <input type="text" class="element-label regular-text" value="${item.label || ""}" />

                    <input type="hidden" class="element-name" value="${item.name || ""}" />

                    <label>Tür (Type):</label>
                    <select class="element-type">
                        ${elementTypes.map(t => `<option value="${t.value}" ${t.value === item.type ? "selected" : ""}>${t.label}</option>`).join('')}
                    </select>

                    <label>
                        <input type="checkbox" class="element-required" ${item.required ? "checked" : ""} /> Zorunlu alan
                    </label>

                    <div class="extra-options" style="margin-top:10px; ${['select','checkbox','city'].includes(item.type) ? '' : 'display:none;'}">
                        <label>Seçenekler (virgülle ayırın):</label>
                        <input type="text" class="element-options regular-text" value="${optionsString}" ${item.type === 'city' ? 'readonly' : ''} />
                    </div>
                </div>
            `;
            $('#form-elements').append(elementHtml);
        });

        renderOutput();
    }

    loadExistingFields();

    /** Yeni Eleman Ekle */
    $('#add-element').on('click', function() {
        counter++;
        const id = `element-${counter}`;

        const html = `
            <div class="dd-form-element" data-id="${id}" style="border:1px solid #ddd; padding:10px; margin-bottom:10px; background:#fff;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong>Eleman #${counter}</strong>
                    <button type="button" class="button-link-delete remove-element">Kaldır</button>
                </div>

                <label>Etiket (Label):</label>
                <input type="text" class="element-label regular-text" />

                <input type="hidden" class="element-name" />

                <label>Tür (Type):</label>
                <select class="element-type">
                    ${elementTypes.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
                </select>

                <label>
                    <input type="checkbox" class="element-required" /> Zorunlu alan
                </label>

                <div class="extra-options" style="display:none; margin-top:10px;">
                    <label>Seçenekler (virgülle ayırın):</label>
                    <input type="text" class="element-options regular-text" />
                </div>
            </div>
        `;
        $('#form-elements').append(html);
    });

    /** Tür değişimi */
    $(document).on('change', '.element-type', function() {
        const type = $(this).val();
        const box = $(this).closest('.dd-form-element').find('.extra-options');
        const input = box.find('.element-options');

        if (['select','checkbox','city'].includes(type)) {
            box.show();
        } else {
            box.hide();
        }

        // 🔥 CITY TYPE: otomatik şehir listesi
        if (type === 'city') {
            input.val(CITY_LIST.join(", "));
            input.prop('readonly', true);
        } else {
            input.prop('readonly', false);
        }

        renderOutput();
    });

    /** Eleman kaldırma */
    $(document).on('click', '.remove-element', function() {
        $(this).closest('.dd-form-element').remove();
        renderOutput();
    });

    /** JSON Render */
    $(document).on('input change', '.dd-form-element input, .dd-form-element select', renderOutput);

    function renderOutput() {
        const items = [];

        $('.dd-form-element').each(function() {
            const el = $(this);
            const type = el.find('.element-type').val();
            const options = el.find('.element-options').val();

            items.push({
                label: el.find('.element-label').val(),
                name: el.find('.element-name').val(),
                type: type === 'city' ? 'select' : type,  // 🔥 city → select dönüşümü
                required: el.find('.element-required').is(':checked'),
                options: ['select','checkbox','city'].includes(type)
                    ? options.split(',').map(o => o.trim()).filter(Boolean)
                    : []
            });
        });

        $('#output').text(JSON.stringify(items, null, 2));
        $('#form_fields').val(JSON.stringify(items));
    }

    // Form elemanları sürükle-bırak
    new Sortable(document.getElementById('form-elements'), {
        animation: 150,
        handle: '.dd-form-element', 
        onEnd: function () {
            renderOutput(); // JSON yeniden oluşturulsun
        }
    });
});
</script>

<style>
.form-group { margin-bottom:1rem; }
.form-group label { display:block; margin-top:8px; font-weight:600; }
#dd-form-builder label { display:block; margin-top:8px; font-weight:500; }
#dd-form-builder input[type="text"],
#dd-form-builder select { width:100%; max-width:400px; }
#dd-form-builder .button-link-delete { color:#d63638; cursor:pointer; }
</style>