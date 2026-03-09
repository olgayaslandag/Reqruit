<?php

class DD_Department
{
    public function __construct()
    {
        add_action( 'admin_menu', [ $this, 'register_admin_menu' ] );
    }

    public function register_admin_menu() 
    {
        add_submenu_page(
            'dd-forms',                     // Ana menü slug
            'Departmanlar',                 // Sayfa başlığı
            'Departmanlar',                 // Menü başlığı
            'manage_options',               // Yetki
            'dd-form-departments',          // Alt sayfa slug
            [ $this, 'index' ]              // Callback
        );

        add_submenu_page(
            '-',                            // Ana menü slug
            'Departmnet Store',             // Sayfa başlığı
            '',                             // Menü başlığı
            'manage_options',               // Yetki
            'dd-form-departments-post',     // Alt sayfa slug
            [ $this, 'store' ]              // Callback
        );

        add_submenu_page(
            '-',                            // Ana menü slug
            'Departmaent Form',             // Sayfa başlığı
            '',                             // Menü başlığı
            'manage_options',               // Yetki
            'dd-form-departments-form',     // Alt sayfa slug
            [ $this, 'form' ]              // Callback
        );
    }

    public function index() 
    {
        global $wpdb;
        $table = $wpdb->prefix . 'dd_departments';

        
        // Silme işlemi
        if (isset($_GET['delete']) && wp_verify_nonce($_GET['_wpnonce'], 'delete_dd_department')) {
            $wpdb->delete($table, ['id' => intval($_GET['delete'])], ['%d']);
            wp_redirect(admin_url('admin.php?page=dd-form-departments'));
            exit;
        }

        // Mevcut Departmanları çek
        $departments = $wpdb->get_results("SELECT * FROM $table ORDER BY parent_department_id ASC, title ASC", OBJECT);
        list($tree, $dept_map) = dd_build_department_tree($departments);
        
        include plugin_dir_path(__FILE__) . '../views/admin/departments.php';
    }

    private function validate_request()
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            wp_die('Geçersiz istek.');
        }

        if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'dd-form-department-add')) {
            wp_die('Güvenlik doğrulaması başarısız.');
        }
    }

    private function sanitize_input()
    {
        $title = sanitize_text_field($_POST['title'] ?? '');
        if (!$title) wp_die('Departman adı zorunludur.');

        $slug = sanitize_title($_POST['slug'] ?? $title);

        return [
            'id'     => intval($_POST['id'] ?? 0),
            'title'  => $title,
            'slug'   => $slug,
            'emails' => sanitize_text_field($_POST['emails'] ?? ''),
            'parent' => intval($_POST['parent_department_id'] ?? 0),
        ];
    }

    private function unique_slug($table, $slug, $id = 0)
    {
        global $wpdb;

        $original = $slug;
        $count = 1;

        while (true) {
            $exists = $id > 0
                ? $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table WHERE slug = %s AND id != %d", $slug, $id))
                : $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table WHERE slug = %s", $slug));

            if (!$exists) break;

            $slug = $original . '-' . $count++;
        }

        return $slug;
    }

    private function insert_department($table, $data)
    {
        global $wpdb;

        $inserted = $wpdb->insert($table, [
            'title'                 => $data['title'],
            'slug'                  => $data['slug'],
            'emails'                => $data['emails'],
            'parent_department_id'  => $data['parent'],
            'created_at'            => current_time('mysql'),
            'updated_at'            => current_time('mysql'),
        ]);

        if (!$inserted) {
            wp_die('Departman eklenirken hata oluştu.');
        }

        return $wpdb->insert_id;
    }


    private function update_department($table, $data)
    {
        global $wpdb;

        $updated = $wpdb->update(
            $table,
            [
                'title'                 => $data['title'],
                'slug'                  => $data['slug'],
                'emails'                => $data['emails'],
                'parent_department_id'  => $data['parent'],
                'updated_at'            => current_time('mysql')
            ],
            ['id' => $data['id']]
        );

        if ($updated === false) {
            wp_die('Departman güncellenirken hata oluştu.');
        }
    }

    public function store()
    {
        $this->validate_request();
        $data = $this->sanitize_input();

        global $wpdb;
        $table = $wpdb->prefix . 'dd_departments';

        // Slug oluştur ve benzersiz hale getir
        $data['slug'] = $this->unique_slug(
            $table, 
            $data['slug'], 
            $data['id']
        );

        // Insert / Update
        if ($data['id'] > 0) {
            $this->update_department($table, $data);
        } else {
            $data['id'] = $this->insert_department($table, $data);
        }

        // Yönlendirme
        wp_redirect(admin_url('admin.php?page=dd-form-departments&success=1&id=' . $data['id']));
        exit;
    }

    public function form()
    {
        global $wpdb;
        $table = $wpdb->prefix . 'dd_departments';

        $id = intval($_GET['id'] ?? 0);

        // Departman (varsa)
        $department = $id 
            ? $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id = %d", $id)) 
            : null;

        // Parent listesi (kendi hariç)
        $departments = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM $table WHERE id != %d ORDER BY title ASC",
                $id
            )
        );

        include plugin_dir_path(__FILE__) . '../views/admin/department_form.php';
    }
}