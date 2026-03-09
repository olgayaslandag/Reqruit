<?php

class DD_FormSubmit
{
    private $service;

    public function __construct()
    {
        $this->service = new DD_FormSubmitService();

        add_action('init', [$this, 'register_endpoint']);
        add_filter('query_vars', [$this, 'register_query_var']);
        add_action('template_redirect', [$this, 'handle_request']);
    }

    public function register_endpoint()
    {
        add_rewrite_rule(
            '^dd-form-submit/?$',
            'index.php?dd_form_submit=1',
            'top'
        );
    }

    public function register_query_var($vars)
    {
        $vars[] = 'dd_form_submit';
        return $vars;
    }

    public function handle_request()
    {
        if (get_query_var('dd_form_submit')) {
            $this->process_form_submission();
            exit;
        }
    }

    public function process_form_submission()
    {
        // Güvenlik
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->redirect_back('error', 'invalid_request');
        }

        if (!wp_verify_nonce($_POST['_wpnonce'], 'dd_form_submit')) {
            $this->redirect_back('error', 'invalid_nonce');
        }

        if (empty($_POST['form_id'])) {
            $this->redirect_back('error', 'missing_form_id');
        }

        $form_id = intval($_POST['form_id']);
        $labels  = $_POST['dd_labels'] ?? [];

        $data = $_POST;
        unset($data['_wpnonce'], $data['_wp_http_referer'], $data['form_id'], $data['dd_labels']);

        try {
            $submission_id = $this->service->handle_submission(
                $form_id,
                $data,
                $_FILES,
                $labels
            );

            // Başarılı gönderim
            $this->redirect_back('success', $submission_id);

        } catch (\Exception $e) {

            // Hata durumunda
            $this->redirect_back('error', urlencode($e->getMessage()));
        }

        exit;
    }

    private function redirect_back($status, $message = '')
    {
        $referer = wp_get_referer();
        if (!$referer) {
            $referer = home_url('/');
        }

        // ✔ TOKEN üret
        $token = bin2hex(random_bytes(16));

        // ✔ Token → geçici olarak kaydet (5 dakikalık)
        set_transient("dd_form_token_$token", [
            'status' => $status,
            'msg'    => $message
        ], 5 * MINUTE_IN_SECONDS);

        // ✔ URL’ye token ekle
        $url = add_query_arg([
            'dd_form_token' => $token
        ], $referer);

        wp_redirect($url);
        exit;
    }
}