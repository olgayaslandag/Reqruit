<?php
/**
 * Plugin Name: Dinamik Dizayn Custom Forms
 * Description: Dinamik form oluşturucu — departmanlara özel formlar ekleyin ve alanları yönetin.
 * Version: 1.0.0
 * Author: Dinamik Dizayn
 * Text Domain: dd-forms
 */

if (!defined('ABSPATH')) exit;

class DD_Forms_Plugin {

    public function __construct() {
        $this->define_constants();
        $this->autoload_classes();
        $this->autoload_helpers();
        $this->autoload_services();
        $this->init_controllers();

        // Hooks
        register_activation_hook(__FILE__, [$this, 'on_activate']);
    }

    /**
     * Plugin sabitleri
     */
    private function define_constants() {
        define('DD_FORMS_PATH', plugin_dir_path(__FILE__));
        define('DD_FORMS_URL', plugin_dir_url(__FILE__));
        define('DD_FORMS_VERSION', '1.0.0');
    }

    /**
     * Controller ve diğer sınıfları yükle
     */
    private function autoload_classes() {
        require_once DD_FORMS_PATH . '/app/controllers/DD_Form.php';
        require_once DD_FORMS_PATH . '/app/controllers/DD_Department.php';
        require_once DD_FORMS_PATH . '/app/controllers/DD_Frontend.php';
        require_once DD_FORMS_PATH . '/app/controllers/DD_FormSubmit.php';
        require_once DD_FORMS_PATH . '/app/controllers/DD_Submission.php';
        require_once DD_FORMS_PATH . '/app/controllers/DD_RenderPDF.php';
        require_once DD_FORMS_PATH . '/app/controllers/DD_Comment.php';
    }

    /** 
     * Helper sınıflarını yükle
     */
    private function autoload_helpers() {
        require_once DD_FORMS_PATH . '/app/helpers/Global_Helper.php';
        require_once DD_FORMS_PATH . '/app/helpers/Form_Element_Helper.php';
        require_once DD_FORMS_PATH . '/app/helpers/Department_Helper.php';
        require_once DD_FORMS_PATH . '/app/helpers/FrontEnd_Helper.php';
        require_once DD_FORMS_PATH . '/app/helpers/Viewer_Helper.php';
        require_once DD_FORMS_PATH . '/app/helpers/Submission_Helper.php';
        require_once DD_FORMS_PATH . '/app/helpers/Comment_Helper.php';
    }

    /** 
     * Helper sınıflarını yükle
     */
    private function autoload_services() {
        require_once DD_FORMS_PATH . '/app/services/DD_FormSubmitService.php';
    }

    /**
     * Controller sınıflarını başlat
     */
    private function init_controllers() {
        new DD_Form();
        new DD_Department();
        new DD_Frontend();
        new DD_FormSubmit();
        new DD_Submission();
        new DD_RenderPDF();
        new DD_Comment();
    }

    /**
     * Eklenti aktif olduğunda tabloları oluştur
     */
    public function on_activate() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();

        $table_departments        = $wpdb->prefix . 'dd_departments';
        $table_forms              = $wpdb->prefix . 'dd_forms';
        $table_form_fields        = $wpdb->prefix . 'dd_form_fields';
        $table_submissions        = $wpdb->prefix . 'dd_submissions';
        $table_submission_details = $wpdb->prefix . 'dd_submission_details';
        $table_submission_comments = $wpdb->prefix . 'dd_submission_comments';

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // Departmanlar
        $sql1 = "CREATE TABLE IF NOT EXISTS $table_departments (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL,
            emails VARCHAR(255) NULL,
            parent_department_id BIGINT UNSIGNED DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";

        // Formlar
        $sql2 = "CREATE TABLE IF NOT EXISTS $table_forms (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            department_id BIGINT UNSIGNED NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY department_id (department_id)
        ) $charset_collate;";

        // Form alanları
        $sql3 = "CREATE TABLE IF NOT EXISTS $table_form_fields (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            form_id BIGINT UNSIGNED NOT NULL,
            label VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            required TINYINT(1) DEFAULT 0,
            options JSON NULL,
            sort_order INT DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY form_id (form_id)
        ) $charset_collate;";

        $sql4 = "CREATE TABLE IF NOT EXISTS $table_submissions (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            form_id BIGINT UNSIGNED NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY form_id (form_id)
        ) $charset_collate;";

        $sql5 = "CREATE TABLE IF NOT EXISTS $table_submission_details (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            submission_id BIGINT UNSIGNED NOT NULL,
            field_name VARCHAR(255) NOT NULL,
            field_label VARCHAR(255) NULL,
            field_value LONGTEXT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY submission_id (submission_id)
        ) $charset_collate;";

        $sql6 = "CREATE TABLE IF NOT EXISTS $table_submission_comments (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            submission_id BIGINT UNSIGNED NOT NULL,
            user_id BIGINT UNSIGNED NULL,
            comment TEXT NOT NULL,
            rating TINYINT UNSIGNED NULL,
            is_private TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY submission_id (submission_id),
            KEY user_id (user_id),
            KEY rating (rating)
        ) $charset_collate;";

        dbDelta($sql1);
        dbDelta($sql2);
        dbDelta($sql3);
        dbDelta($sql4);
        dbDelta($sql5);
        dbDelta($sql6);
    }
}

// Başlat
new DD_Forms_Plugin();