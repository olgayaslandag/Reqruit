<?php

if (! function_exists('csp_nonce')) {
    function csp_nonce(): string
    {
        static $nonce = null;

        if ($nonce === null) {
            $nonce = base64_encode(random_bytes(16));
        }

        return $nonce;
    }
}
