<?php

class DD_Comment
{
    public function __construct()
    {
        add_action( 'admin_post_dd_comment_post', [ $this, 'post' ] );
    }   

    public function register_admin_menu() 
    {        
        add_submenu_page(
            '-',                          // Ana menü slug
            'Yorum Post',                 // Sayfa başlığı
            '',                           // Menü başlığı
            'manage_options',             // Yetki
            'dd-comment-post',            // Alt sayfa slug
            [ $this, 'post' ]             // Callback
        ); 
    }

    public function post()
    {
        if (!current_user_can('manage_options')) {
            wp_die('Yetkiniz yok');
        }

        if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'dd_add_comment')) {
            wp_die('Geçersiz istek');
        }

        global $wpdb;
        $table = $wpdb->prefix . 'dd_submission_comments';

        $submission_id = intval($_POST['submission_id'] ?? 0);
        if (!$submission_id) {
            wp_die('Submission bulunamadı');
        }

        $comment = sanitize_textarea_field($_POST['comment'] ?? '');
        if ($comment === '') {
            wp_die('Yorum boş olamaz');
        }

        $rating = ($_POST['rating'] ?? '') !== '' ? intval($_POST['rating']) : null;
        $is_private = isset($_POST['is_private']) ? 1 : 0;

        $wpdb->insert(
            $table,
            [
                'submission_id' => $submission_id,
                'user_id'       => get_current_user_id(),
                'comment'       => $comment,
                'rating'        => $rating,
                'is_private'    => $is_private,
                'created_at'    => current_time('mysql'),
            ]
        );

        wp_safe_redirect(
            admin_url('admin.php?page=dd-submission-detail&id=' . $submission_id)
        );
        exit;
    }
}