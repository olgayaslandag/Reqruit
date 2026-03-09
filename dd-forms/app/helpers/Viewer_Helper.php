<?php

function dd_view($file, $data = [])
{
    $path = plugin_dir_path(__DIR__) . 'views/' . $file;

    if (!file_exists($path)) {
        return "<p>View bulunamadı: $path</p>";
    }

    ob_start();
    extract($data);
    include $path;
    return ob_get_clean();
}