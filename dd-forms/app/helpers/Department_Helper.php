<?php

function dd_build_department_tree($departments) 
{
    $tree = [];
    $dept_map = [];

    foreach ($departments as $dep) {
        $tree[$dep->parent_department_id][] = $dep;
        $dept_map[$dep->id] = $dep;
    }

    return [$tree, $dept_map];
}



function dd_render_department_rows($parent_id, $tree, $dept_map, $depth = 0) 
{
    if (empty($tree[$parent_id])) {
        return;
    }

    foreach ($tree[$parent_id] as $dep) {

        $indent = str_repeat('&mdash; ', $depth);

        $edit_url   = admin_url('admin.php?page=dd-form-departments-form&id=' . $dep->id);
        $delete_url = admin_url('admin.php?page=dd-form-departments&delete=' . $dep->id . '&_wpnonce=' . wp_create_nonce('delete_dd_department'));

        // Üst departmanın title'ını al, yoksa '—'
        $parent_title = ($dep->parent_department_id && isset($dept_map[$dep->parent_department_id]))
            ? esc_html($dept_map[$dep->parent_department_id]->title)
            : '—';

        echo "<tr>
                <td>
                    <a href='{$edit_url}'>{$indent}" . esc_html($dep->title) . "</a>
                    <div class='row-actions'>
                        <span><a href='{$edit_url}'>Düzenle</a> | </span>
                        <span class='trash'><a href='{$delete_url}'>Çöp</a></span>
                    </div>
                </td>
                <td>" . esc_html($dep->emails) . "</td>
                <td>{$parent_title}</td>
              </tr>";

        // Çocukları ekle
        dd_render_department_rows($dep->id, $tree, $dept_map, $depth + 1);
    }
}