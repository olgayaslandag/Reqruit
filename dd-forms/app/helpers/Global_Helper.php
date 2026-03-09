<?php

function dd_link_edit_delete($items, $pages = ['', ''], $nonce = '')
{
    foreach ($items as $item) {
        $item->edit_url = add_query_arg([
            'page' => $pages[0],
            'id'   => $item->id,
        ], admin_url('admin.php'));
        
        $item->delete_url = wp_nonce_url(
            add_query_arg([
                'page' => $pages[1],
                'id'   => $item->id,
            ], admin_url('admin.php')),
            $nonce
        );
    }

    return $items;
}

function dd_link_prev_delete($items, $pages = ['', ''], $nonce = '')
{
    foreach ($items as $sub) {
        $sub->prev_url = add_query_arg([
            'page' => $pages[0],
            'id'   => $sub->id,
        ], admin_url('admin.php'));
        
        $sub->delete_url = wp_nonce_url(
            add_query_arg([
                'page' => $pages[1],
                'id'   => $sub->id,
            ], admin_url('admin.php')),
            $nonce
        );
    }

    return $items;
}