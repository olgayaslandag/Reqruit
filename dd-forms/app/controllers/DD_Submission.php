<?php

class DD_Submission
{
    public function __construct()
    {
        add_action( 'admin_menu', [ $this, 'register_admin_menu' ] );
    }

    public function register_admin_menu() 
    {        
        add_submenu_page(
            'dd-forms',                   // Ana menü slug
            'Başvurular',                 // Sayfa başlığı
            'Başvurular',                 // Menü başlığı
            'manage_options',             // Yetki
            'dd-form-submissions',        // Alt sayfa slug
            [ $this, 'admin_index' ]      // Callback
        );  
        
        add_submenu_page(
            '-',                          // Ana menü slug
            'Başvuru Detayları',          // Sayfa başlığı
            '',                           // Menü başlığı
            'manage_options',             // Yetki
            'dd-submission-detail',       // Alt sayfa slug
            [ $this, 'admin_detail' ]     // Callback
        ); 
    }

    public function admin_index()
    {
        global $wpdb;
        $table_submissions = $wpdb->prefix . 'dd_submissions';  
        $table_forms       = $wpdb->prefix . 'dd_forms';
        $table_departments = $wpdb->prefix . 'dd_departments';
        $table_comments = $wpdb->prefix . 'dd_submission_comments';
        $table_details = $wpdb->prefix . 'dd_submission_details';


        $date_from  = !empty($_GET['date_from']) ? sanitize_text_field($_GET['date_from']) : null;
        $date_to    = !empty($_GET['date_to']) ? sanitize_text_field($_GET['date_to']) : null;
        $department = !empty($_GET['department']) ? intval($_GET['department']) : null;
        $form       = !empty($_GET['form']) ? intval($_GET['form']) : null;


        if ($date_from) {
            $where[]  = 'DATE(s.created_at) >= %s';
            $params[] = $date_from;
        }

        if ($date_to) {
            $where[]  = 'DATE(s.created_at) <= %s';
            $params[] = $date_to;
        }

        if ($department) {
            $where[]  = 'f.department_id = %d';
            $params[] = $department;
        }


        if ($form) {
            $where[]  = 'f.id = %d';
            $params[] = $form;
        }

        $where_sql = '';

        if (!empty($where)) {
            $where_sql = 'WHERE ' . implode(' AND ', $where);
        }

        $sql = "
            SELECT 
                s.id,
                f.name AS form_name,
                d.title AS department_title,
                s.created_at,

                COUNT(c.id) AS comment_count,
                ROUND(AVG(c.rating), 2) AS avg_rating_raw,

                MAX(det.field_value) AS person_name

            FROM $table_submissions AS s

            INNER JOIN $table_forms AS f 
                ON s.form_id = f.id

            LEFT JOIN $table_departments AS d 
                ON f.department_id = d.id

            LEFT JOIN $table_comments AS c
                ON c.submission_id = s.id

            LEFT JOIN $table_details AS det
                ON det.submission_id = s.id
            AND det.field_name IN ('name', 'adsoyad', 'ad_soyad', 'ad', 'isim_soyisim', 'isim')

            $where_sql

            GROUP BY s.id

            ORDER BY s.created_at DESC
        ";

        if (!empty($params)) {
            $sql = $wpdb->prepare($sql, $params);
        }

        $submissions = $wpdb->get_results($sql);

        
        if ($wpdb->last_error) {
            wp_die($wpdb->last_error);
            
        }
                
        $submissions = dd_link_prev_delete($submissions, ['dd-submission-detail', 'dd-form-submission-delete'], 'delete_dd_submission');

        foreach ($submissions as &$sub) {

            // Tarih
            $sub->created_at = date('Y-m-d H:i', strtotime($sub->created_at));

            // Yorum sayısı
            $sub->comment_count = (int) $sub->comment_count;

            // Ortalama puan
            if ($sub->avg_rating_raw !== null) {
                $raw = (float) $sub->avg_rating_raw;

                // 0.5 adımına yuvarla (3.1 → 3.0 | 3.6 → 3.5)
                $sub->avg_rating = floor($raw * 2) / 2;

            } else {
                $sub->avg_rating = null;
            }
        }

        $departments = $this->get_departments();
        $forms      = $this->get_forms();

        include plugin_dir_path(__FILE__) . '../views/admin/submissions.php';
    }

    public function admin_detail()
    {
        $submission_id = intval($_GET['id']);
        if(!$submission_id) return;

        global $wpdb;
        $table_submissions = $wpdb->prefix . 'dd_submissions';
        $table_forms       = $wpdb->prefix . 'dd_forms';
        $table_submission_details = $wpdb->prefix . 'dd_submission_details';
        $table_departments = $wpdb->prefix . 'dd_departments';
        $table_comments     = $wpdb->prefix . 'dd_submission_comments';
        $table_users        = $wpdb->prefix . 'users';

        $submission = $wpdb->get_row(
            $wpdb->prepare(
                "
                SELECT 
                    s.id,
                    s.form_id,
                    f.name,
                    s.created_at,
                    dep.title,
                    d.field_label,
                    GROUP_CONCAT(
                        CONCAT(
                            IFNULL(d.field_name, ''),
                            '::',
                            IFNULL(d.field_label, ''),
                            '::',
                            REPLACE(IFNULL(d.field_value, ''), ';', '{semicolon}')
                        )
                        SEPARATOR ';'
                    ) AS details_concat
                FROM $table_submissions AS s
                LEFT JOIN $table_forms AS f 
                    ON s.form_id = f.id
                LEFT JOIN $table_submission_details AS d 
                    ON d.submission_id = s.id
                LEFT JOIN $table_departments AS dep 
                    ON f.department_id = dep.id
                WHERE s.id = %d
                GROUP BY s.id
                ",
                $submission_id // prepare'ın parametresi
            )
        );

        
        if ($wpdb->last_error) {
            wp_die($wpdb->last_error);
            
        }
        
        
        //exit;
        $submission = get_with_details_single($submission);        
        $details = normalize_submission_details($submission->details);
        //unset($submission->details);

        $comments = $wpdb->get_results(
            $wpdb->prepare(
                "
                SELECT 
                    c.id,
                    c.submission_id,
                    c.user_id,
                    c.comment,
                    c.rating,
                    c.is_private,
                    c.created_at,
                    u.display_name,
                    u.user_email
                FROM $table_comments AS c
                LEFT JOIN $table_users AS u 
                    ON c.user_id = u.id
                WHERE c.submission_id = %d
                ORDER BY c.created_at DESC
                ",
                $submission->id
            )
        );

        foreach ($comments as &$comment) {
            $comment->created_at = date('Y-m-d H:i', strtotime($comment->created_at));
        }

        //echo "<pre>" . print_r($comments, true) . "</pre>";
        include plugin_dir_path(__FILE__) . '../views/admin/submission.php';
    }

    private function get_departments()
    {
        global $wpdb;
        $table = $wpdb->prefix . 'dd_departments';

        return $wpdb->get_results("
            SELECT * FROM $table 
            ORDER BY parent_department_id ASC, title ASC
        ");
    }

    private function get_forms()
    {
        global $wpdb;
        $table = $wpdb->prefix . 'dd_forms';

        return $wpdb->get_results("
            SELECT * FROM $table 
            ORDER BY name ASC
        ");
    }
}