<?php

function dd_render_stars($rating, $max = 5)
{
    if ($rating === null) {
        return '<span class="dd-no-rating">—</span>';
    }

    $rating = floatval($rating);

    $full  = floor($rating);
    $half  = ($rating - $full) >= 0.5 ? 1 : 0;
    $empty = $max - $full - $half;

    $html = '<span class="dd-stars">';

    // Dolu yıldızlar
    for ($i = 0; $i < $full; $i++) {
        $html .= '<span class="dashicons dashicons-star-filled"></span>';
    }

    // Yarım yıldız
    if ($half) {
        $html .= '<span class="dashicons dashicons-star-half"></span>';
    }

    // Boş yıldızlar
    for ($i = 0; $i < $empty; $i++) {
        $html .= '<span class="dashicons dashicons-star-empty"></span>';
    }

    $html .= '</span>';

    return $html;
}