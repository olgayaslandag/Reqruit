<?php

function old($key, $default = '')
{
    return isset($_POST[$key]) ? sanitize_text_field($_POST[$key]) : $default;
}

function wp_admin_text_input($args = []) 
{
    $defaults = [
        'id'    => '',
        'label' => '',
        'value' => '',
        'type'  => 'text',
        'class' => 'regular-text',
        'desc'  => ''
    ];

    $a = array_merge($defaults, $args);

    echo '
    <tr>
        <th><label for="'.$a['id'].'">'.$a['label'].'</label></th>
        <td>
            <input type="'.$a['type'].'" 
                id="'.$a['id'].'" 
                name="'.$a['id'].'" 
                class="'.$a['class'].'" 
                value="'.esc_attr($a['value']).'">
            <p class="description">'.$a['desc'].'</p>
        </td>
    </tr>';
}


function wp_admin_select_input($args = [])
{
    $defaults = [
        'id'            => '',
        'label'         => '',
        'name'          => '',
        'tree'          => false,
        'options'       => [],
        'selected'      => null,
        'multiple'      => false,
        'class'         => 'regular-text',
        'required'      => false,
        'desc'          => '',
        'first_option'  => null, // <-- EKLENDİ
    ];

    $args = wp_parse_args($args, $defaults);

    if (!$args['name']) {
        $args['name'] = $args['id'];
    }

    $name_attr = $args['multiple'] ? $args['name'] . '[]' : $args['name'];
    $selected_values = is_array($args['selected']) ? $args['selected'] : [$args['selected']];
    ?>
    <tr>
        <th scope="row">
            <label for="<?php echo esc_attr($args['id']); ?>">
                <?php echo esc_html($args['label']); ?>
            </label>
        </th>
        <td>
            <select
                id="<?php echo esc_attr($args['id']); ?>"
                name="<?php echo esc_attr($name_attr); ?>"
                class="<?php echo esc_attr($args['class']); ?>"
                <?php echo $args['multiple'] ? 'multiple' : ''; ?>
                <?php echo $args['required'] ? 'required' : ''; ?>
            >

                <?php
                // İlk option varsa ekle
                if ($args['first_option'] !== null) {
                    $selected = in_array('', $selected_values) ? 'selected' : '';
                    echo "<option value='' {$selected}>" . esc_html($args['first_option']) . "</option>";
                }

                // Tree (hiyerarşik) select
                if ($args['tree']) {

                    // Recursive çağrı
                    $render_tree = function($parent_id, $tree, $depth = 0) use (&$render_tree, $selected_values) {
                        if (empty($tree[$parent_id])) {
                            return;
                        }

                        foreach ($tree[$parent_id] as $dep) {
                            $indent = str_repeat('&mdash; ', $depth);
                            $selected = in_array($dep->id, $selected_values) ? 'selected' : '';

                            echo "<option value='{$dep->id}' {$selected}>{$indent} " . esc_html($dep->title) . "</option>";

                            $render_tree($dep->id, $tree, $depth + 1);
                        }
                    };

                    $render_tree(0, $args['options']);

                } else {
                    // Düz select
                    foreach ($args['options'] as $value => $label) {
                        $selected = in_array($value, $selected_values) ? 'selected' : '';
                        echo "<option value='" . esc_attr($value) . "' {$selected}>" . esc_html($label) . "</option>";
                    }
                }
                ?>

            </select>

            <?php if ($args['desc']): ?>
                <p class="description"><?php echo esc_html($args['desc']); ?></p>
            <?php endif; ?>
        </td>
    </tr>
    <?php
}


function wp_admin_textarea_input($args = [])
{
    $defaults = [
        'id'    => '',
        'label' => '',
        'value' => '',
        'class' => 'large-text',
        'rows'  => 5,
        'desc'  => ''
    ];

    $a = array_merge($defaults, $args);

    echo '
    <tr>
        <th><label for="'.$a['id'].'">'.$a['label'].'</label></th>
        <td>
            <textarea 
                id="'.$a['id'].'" 
                name="'.$a['id'].'" 
                class="'.$a['class'].'" 
                rows="'.$a['rows'].'"
            >'.esc_textarea($a['value']).'</textarea>
            <p class="description">'.$a['desc'].'</p>
        </td>
    </tr>';
}