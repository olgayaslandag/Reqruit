<?php

class DD_Frontend
{
    public function __construct()
    {
        add_shortcode('dd_ik_form', [$this, 'shortcode']);
    }

    public function shortcode($atts = [])
    {
        $atts = shortcode_atts([
            'parent' => 0,
        ], $atts);

        // Eğer URL'de dd_dep varsa onu parent olarak al
        if (isset($_GET['dd_dep'])) {
            $atts['parent'] = intval($_GET['dd_dep']);
        }
        
        $parent_id = intval($atts['parent']);

        // Model (data)
        $departments = $this->get_child_departments($parent_id);
        $form        = $this->get_department_form($parent_id);

        // View’e gönderilecek data
        $data = [
            'parent_id'   => $parent_id,
            'departments' => $departments,
            'form'        => $form,
        ];

        return dd_view('frontend/form_frontend.php', $data);
    }

    /* -------------------------
     * MODEL METOTLARI
     * ------------------------- */

    private function get_child_departments($parent_id)
    {
        global $wpdb;
        $table = $wpdb->prefix . 'dd_departments';

        return $wpdb->get_results(
            $wpdb->prepare("
                SELECT * FROM $table
                WHERE parent_department_id = %d
                ORDER BY title ASC
            ", $parent_id)
        );
    }

    private function get_department_form($parent_id)
    {
        global $wpdb;

        $table_forms  = $wpdb->prefix . 'dd_forms';
        $table_fields = $wpdb->prefix . 'dd_form_fields';

        // 1) Formu çek
        $form = $wpdb->get_row(
            $wpdb->prepare("
                SELECT * FROM $table_forms
                WHERE department_id = %d
                LIMIT 1
            ", $parent_id)
        );

        if (!$form) {
            return null;
        }

        // 2) Form alanlarını çek
        $fields = $wpdb->get_results(
            $wpdb->prepare("
                SELECT * FROM $table_fields
                WHERE form_id = %d
                ORDER BY sort_order ASC
            ", $form->id)
        );

        // 3) Alanları form objesine ekle
        $form->fields = $fields;

        return $form;
    }
}