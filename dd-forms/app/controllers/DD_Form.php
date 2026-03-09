<?php

class DD_Form
{
    public function __construct()
    {
        add_action( 'admin_menu', [ $this, 'register_admin_menu' ] );        
    }

    public function register_admin_menu() 
    {
        add_menu_page(
            'IK Formlar',                   // Sayfa başlığı
            'IK Formlar',                   // Menü başlığı
            'manage_options',               // Yetki
            'dd-forms',                     // Slug
            [ $this, 'index' ],             // Callback
            'dashicons-feedback',           // Menü ikonu
            25                              // Menü sırası
        );

        // Alt Menü: Yeni Form
        $page_form = add_submenu_page(
            'dd-forms',                   // Ana menü slug
            'Yeni Form',                  // Sayfa başlığı
            'Yeni Form',                  // Menü başlığı
            'manage_options',             // Yetki
            'dd-form-add',                // Alt sayfa slug
            [ $this, 'form' ]             // Callback
        );    
        
        add_submenu_page(
            '-',                          // Ana menü slug
            'Store',                      // Sayfa başlığı
            '',                           // Menü başlığı
            'manage_options',             // Yetki
            'dd-form-store',              // Alt sayfa slug
            [ $this, 'store' ]            // Callback
        ); 
        add_submenu_page(
            '-',                          // Ana menü slug
            'Delete',                     // Sayfa başlığı
            '',                           // Menü başlığı
            'manage_options',             // Yetki
            'dd-form-delete',             // Alt sayfa slug
            [ $this, 'delete' ] // Callback
        );  
        
        add_action("admin_print_scripts-$page_form", [$this, 'dd_enqueue_sortable']);
    }

    public function index() 
    {
        global $wpdb;
        $table_forms        = $wpdb->prefix . 'dd_forms';
        $table_departments  = $wpdb->prefix . 'dd_departments';

        $forms = $wpdb->get_results("
            SELECT 
                f.id,
                f.name,
                f.description,
                f.department_id,
                d.title AS department_title,
                d.emails AS department_emails
            FROM $table_forms AS f
            LEFT JOIN $table_departments AS d 
                ON f.department_id = d.id
            ORDER BY f.name ASC
        ", OBJECT);

        $departments = $wpdb->get_results("
            SELECT 
                id, title 
            FROM 
                $table_departments 
            ORDER BY title ASC", OBJECT);



        $forms = dd_link_edit_delete($forms, ['dd-form-add', 'dd-form-delete'], 'delete_dd_form');
        
        include plugin_dir_path( __FILE__ ) . '../views/admin/form_list.php';
    }  

    public function store()
    {
        $this->validate_request();

        global $wpdb;

        $table_forms  = $wpdb->prefix . 'dd_forms';
        $table_fields = $wpdb->prefix . 'dd_form_fields';

        // 1) Form verilerini hazırla
        $form = $this->prepare_form_data();

        // 2) Slug oluştur
        $form['slug'] = $this->generate_unique_slug($form['slug'], $form['id'], $table_forms);

        // 3) Formu kaydet (insert/update)
        $form_id = $this->save_form_record($table_forms, $form);

        // 4) Alanları kaydet
        $this->save_form_fields($table_fields, $form_id, $form['fields']);

        // 5) Yönlendir
        $this->redirect_after_save($form_id);
    }

    public function form()
    {
        $form        = $this->get_form();
        $departments = $this->get_departments();

        list($tree, $dept_map) = dd_build_department_tree($departments);

        include plugin_dir_path(__FILE__) . '../views/admin/form.php';
    }

    private function get_form()
    {
        global $wpdb;
        $table_forms  = $wpdb->prefix . 'dd_forms';
        $table_fields = $wpdb->prefix . 'dd_form_fields';

        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if ($id) {
            // Form bilgilerini al
            $form = $wpdb->get_row(
                $wpdb->prepare("SELECT * FROM $table_forms WHERE id = %d", $id)
            );

            if ($form) {
                // Form alanlarını al
                $fields = $wpdb->get_results(
                    $wpdb->prepare("SELECT * FROM $table_fields WHERE form_id = %d ORDER BY sort_order ASC", $id),
                    ARRAY_A
                );

                // Her field'in options alanını garanti array yap
                foreach ($fields as &$f) {
                    if (!isset($f['options']) || !is_array($f['options'])) {
                        // Eğer DB'de JSON olarak tutuluyorsa decode et
                        $opts = isset($f['options']) ? json_decode($f['options'], true) : [];
                        $f['options'] = is_array($opts) ? $opts : [];
                    }
                }

                $form->fields_json = !empty($fields) ? wp_json_encode($fields) : '[]';
                return $form;
            }
        }

        // Boş form
        return (object) [
            'id'            => 0,
            'name'          => '',
            'description'   => '',
            'department_id' => '',
            'fields_json'   => '[]',
        ];
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

    private function validate_request()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            wp_die('Geçersiz istek.');
        }

        if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'dd-form-add')) {
            wp_die('Güvenlik doğrulaması başarısız.');
        }
    }

    private function prepare_form_data()
    {
        return [
            'id'            => isset($_POST['id']) ? intval($_POST['id']) : 0,
            'name'          => sanitize_text_field($_POST['name']),
            'description'   => sanitize_textarea_field($_POST['description']),
            'department_id' => intval($_POST['department_id']),
            'slug'          => sanitize_title($_POST['slug'] ?? $_POST['name']),
            'fields'        => json_decode(stripslashes($_POST['form_fields'] ?? '[]'), true)
        ];
    }

    private function generate_unique_slug($slug, $id, $table)
    {
        global $wpdb;

        $original = $slug;
        $count = 1;

        $exists = $this->slug_exists($slug, $id, $table);

        while ($exists) {
            $slug = $original . '-' . $count;
            $count++;
            $exists = $this->slug_exists($slug, $id, $table);
        }

        return $slug;
    }

    private function slug_exists($slug, $id, $table)
    {
        global $wpdb;

        if ($id > 0) {
            return $wpdb->get_var(
                $wpdb->prepare("SELECT COUNT(*) FROM $table WHERE slug = %s AND id != %d", $slug, $id)
            );
        }

        return $wpdb->get_var(
            $wpdb->prepare("SELECT COUNT(*) FROM $table WHERE slug = %s", $slug)
        );
    }

    private function save_form_record($table, $form)
    {
        global $wpdb;

        $data = [
            'department_id' => $form['department_id'],
            'name'          => $form['name'],
            'description'   => $form['description'],
            //'slug'          => $form['slug'],
            'updated_at'    => current_time('mysql'),
        ];

        // UPDATE
        if (!empty($form['id'])) {

            $updated = $wpdb->update($table, $data, ['id' => $form['id']]);

            if ($updated === false) {
                wp_die(
                    "<h2>Form güncellenemedi</h2>
                    <p><strong>SQL Hatası:</strong> {$wpdb->last_error}</p>
                    <p><strong>Sorgu:</strong> {$wpdb->last_query}</p>"
                );
            }

            return $form['id'];
        }

        // INSERT
        $data['created_at'] = current_time('mysql');
        $inserted = $wpdb->insert($table, $data);

        if ($inserted === false) {
            wp_die(
                "<h2>Yeni form eklenemedi</h2>
                <p><strong>SQL Hatası:</strong> {$wpdb->last_error}</p>
                <p><strong>Sorgu:</strong> {$wpdb->last_query}</p>"
            );
        }

        return $wpdb->insert_id;
    }

    private function save_form_fields($table, $form_id, $fields)
    {
        global $wpdb;

        // 1) Eski field kayıtlarını sil
        $wpdb->delete($table, ['form_id' => $form_id]);

        // 2) Yeni fields boşsa çık
        if (empty($fields) || !is_array($fields)) {
            return;
        }

        $sort = 1;

        // 3) Yeni field kayıtlarını ekle
        foreach ($fields as $f) {
            $wpdb->insert($table, [
                'form_id'     => $form_id,
                'label'       => sanitize_text_field($f['label']),
                'name'        => sanitize_title($f['name']),
                'type'        => sanitize_text_field($f['type']),
                'required'    => !empty($f['required']) ? 1 : 0,
                'options'     => json_encode($f['options'] ?? [], JSON_UNESCAPED_UNICODE),
                'sort_order'  => $sort++,
                'created_at'  => current_time('mysql'),
                'updated_at'  => current_time('mysql'),
            ]);
        }
    }

    private function redirect_after_save($id)
    {
        wp_redirect(admin_url('admin.php?page=dd-forms&saved=1&id=' . $id));
        exit;
    }

    public function delete()
    {
        global $wpdb;

        // Tablolar
        $table_forms  = $wpdb->prefix . 'dd_forms';
        $table_fields = $wpdb->prefix . 'dd_form_fields';

        // ID var mı?
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if (!$id) {
            wp_die("Geçersiz form ID.");
        }

        // Nonce kontrolü
        if (!wp_verify_nonce($_GET['_wpnonce'] ?? '', 'delete_dd_form')) {
            wp_die("Güvenlik hatası: Nonce doğrulanamadı.");
        }

        // Önce field'ları sil
        $wpdb->delete($table_fields, ['form_id' => $id]);

        // Form kaydını sil
        $wpdb->delete($table_forms, ['id' => $id]);

        // Yönlendir
        wp_redirect(
            admin_url("admin.php?page=dd-forms&deleted=1")
        );
        exit;
    }

    public function dd_enqueue_sortable() 
    {
        wp_enqueue_script(
            'sortablejs',
            'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js',
            [],
            null,
            true
        );
    }
}