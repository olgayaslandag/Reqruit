<?php

class DD_FormSubmitService
{
    private $wpdb;
    private $table_submissions;
    private $table_details;
    private $table_forms;
    private $table_departments;

    public function __construct()
    {
        global $wpdb;

        $this->wpdb = $wpdb;
        $this->table_submissions  = $wpdb->prefix . 'dd_submissions';
        $this->table_details      = $wpdb->prefix . 'dd_submission_details';
        $this->table_forms        = $wpdb->prefix . 'dd_forms';
        $this->table_departments  = $wpdb->prefix . 'dd_departments';
    }


    /** --------------------------------
     * FORM SUBMISSION YÖNETİMİ
     * --------------------------------*/
    public function handle_submission($form_id, $submitted_data, $files, $labels)
    {
        $submission_id = $this->save_main_row($form_id);
        $uploaded_files = $this->handle_uploaded_files($files);

        // Dosyaları forma ekle
        $submitted_data = array_merge($submitted_data, $uploaded_files);

        $this->save_details($submission_id, $submitted_data, $labels);
        $this->send_notification_email($form_id, $submitted_data);

        return $submission_id;
    }


    /** --------------------------------
     * 1) Ana kayıt
     * --------------------------------*/
    private function save_main_row($form_id)
    {
        $this->wpdb->insert($this->table_submissions, [
            'form_id'    => $form_id,
            'created_at' => current_time('mysql'),
        ]);

        if (!$this->wpdb->insert_id) {
            wp_die('DB ERROR (Ana Kayıt): ' . $this->wpdb->last_error);
        }

        return $this->wpdb->insert_id;
    }


    /** --------------------------------
     * 2) Dosya yükleme
     * --------------------------------*/
    private function handle_uploaded_files($files)
    {
        $uploaded = [];

        if (empty($files)) return $uploaded;

        require_once(ABSPATH . 'wp-admin/includes/file.php');

        foreach ($files as $name => $info) {
            if (empty($info['name'])) continue;

            $result = wp_handle_upload($info, ['test_form' => false]);

            $uploaded[$name] = $result['url'] ?? ('UPLOAD_ERROR: ' . $result['error']);
        }

        return $uploaded;
    }


    /** --------------------------------
     * 3) Detayları kaydet
     * --------------------------------*/
    private function save_details($submission_id, $data, $labels)
    {
        foreach ($data as $field => $value) {

            if ($field === 'dd_labels') continue;

            $label = $labels[$field] ?? $field;

            $this->wpdb->insert($this->table_details, [
                'submission_id' => $submission_id,
                'field_name'    => $field,
                'field_label'   => $label,
                'field_value'   => maybe_serialize($value),
                'created_at'    => current_time('mysql'),
            ]);
        }
    }


    /** --------------------------------
     * 4) Mail Gönderimi
     * --------------------------------*/
    private function send_notification_email($form_id, $data)
    {
        // BODY
        $body = "Yeni bir form gönderimi alındı:\n\n";

        foreach ($data as $k => $v) {
            if (is_array($v)) $v = implode(', ', $v);
            $body .= ucfirst($k) . ": " . $v . "\n";
        }

        // ALACAKLAR
        $recipients = [ get_option('admin_email') ];

        $dept_emails = $this->wpdb->get_var(
            $this->wpdb->prepare(
                "SELECT emails FROM {$this->table_departments} 
                 WHERE id = (SELECT department_id FROM {$this->table_forms} WHERE id = %d)",
                $form_id
            )
        );

        if ($dept_emails) {
            $extra = array_filter(array_map('trim', explode(',', $dept_emails)));
            $recipients = array_unique(array_merge($recipients, $extra));
        }

        wp_mail($recipients, "Yeni Form Gönderimi", $body);
    }    
}