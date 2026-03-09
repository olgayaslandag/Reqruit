<?php

function dd_render_form_frontend($form)
{
    $fields = $form->fields ?? [];
    
    $html  = "<h2>" . esc_html($form->name) . "</h2>";
    $html .= "<p>" . esc_html($form->description) . "</p>";
    $html .= "<form method='post' enctype='multipart/form-data' class='dd-frontend-form' method='post' action='" . esc_url(home_url('/dd-form-submit/')) . "'>";
    $html .= wp_nonce_field('dd_form_submit', '_wpnonce', true, false);
    $html .= "<input type='hidden' name='form_id' value='{$form->id}'>";

    foreach ($fields as $f) {
        $label    = esc_html($f->label);
        $name     = esc_attr($f->name);
        $type     = esc_attr($f->type);
        $required = $f->required ? "required" : "";

        $options = [];
        if (!empty($f->options)) {
            // DB'den serialized olarak gelebilir
            //$options = maybe_unserialize($f->options);
            $options = json_decode($f->options, true);
            if (!is_array($options)) $options = [];
        }        

        $html .= "<div class='dd-field dd-field-{$type}'>";
        $html .= "<label>{$label}" . ($required ? " <span style='color:red'>*</span>" : "") . "</label>";

        switch ($type) {

            /* -------------------------
             * METİN / NUMBER / DATE
             * ------------------------- */
            case 'text':
            case 'number':
            case 'date':
                $html .= "<input type='{$type}' name='{$name}' {$required}>";
                break;

            /* -------------------------
             * TEXTAREA
             * ------------------------- */
            case 'textarea':
                $html .= "<textarea name='{$name}' {$required}></textarea>";
                break;

            /* -------------------------
             * DOSYA
             * ------------------------- */
            case 'file':
                $html .= "<input type='file' name='{$name}' {$required}>";
                break;

            /* -------------------------
             * SELECT & CITY
             * ------------------------- */
            case 'select':
                $html .= "<select name='{$name}' {$required}>";
                foreach ($options as $opt) {
                    $html .= "<option value='" . esc_attr($opt) . "'>" . esc_html($opt) . "</option>";
                }
                $html .= "</select>";
                break;

            /* -------------------------
             * CHECKBOX (çoklu)
             * ------------------------- */
            case 'checkbox':
                foreach ($options as $opt) {
                    $id = $name . '_' . sanitize_title($opt);
                    $html .= "
                        <label style='display:block;'>
                            <input type='checkbox' id='{$id}' name='{$name}[]' value='" . esc_attr($opt) . "'>
                            " . esc_html($opt) . "
                        </label>";
                }
                break;

            /* -------------------------
             * EXPERIENCES (Tekrarlanabilir alan)
             * ------------------------- */
            case 'experiences':
                $html .= "
                    <div class='dd-experiences-wrapper' data-name='{$name}'>
                        <div class='dd-experience-item'>
                            <input type='text' name='{$name}[]' placeholder='Deneyim' {$required}>
                            <button type='button' class='dd-remove-exp'>Sil</button>
                        </div>
                    </div>

                    <button type='button' class='dd-add-exp' data-target='{$name}'>+ Deneyim Ekle</button>
                ";
                break;

            default:
                $html .= "<input type='text' name='{$name}' {$required}>";
                break;
        }
        $html .= "<input type='hidden' name='dd_labels[{$name}]' value='{$label}'>";
        $html .= "</div>";
    }

    $html .= "<button type='submit'>Gönder</button>";
    $html .= "</form>";

    // JS: Experiences alanı için
    $html .= "
    <script>
    document.addEventListener('click', function(e) {

        if (e.target.classList.contains('dd-add-exp')) {
            let name = e.target.dataset.target;
            let wrap = document.querySelector('.dd-experiences-wrapper[data-name=\"'+name+'\"]').cloneNode(true);
            
            // İçeriği temizle
            wrap.querySelectorAll('input').forEach(i => i.value = '');

            e.target.insertAdjacentElement('beforebegin', wrap);
        }

        if (e.target.classList.contains('dd-remove-exp')) {
            let item = e.target.closest('.dd-experience-item');
            if (document.querySelectorAll('.dd-experience-item').length > 1) {
                item.remove();
            }
        }

    });
    </script>";

    return $html;
}