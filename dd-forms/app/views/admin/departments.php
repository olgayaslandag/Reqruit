<div class="wrap">
    <h1>Departmanlar</h1>
    <p>Departmanları ekleyebilir, düzenleyebilir veya silebilirsiniz.</p>

    <div style="display:flex; gap:30px; align-items:flex-start;">

        <!-- Sol: Yeni Departman Formu -->
        <div style="flex:1; max-width:50%;">
            <form action="<?php echo admin_url('admin.php?page=dd-form-departments-post'); ?>" method="post">
                <?php wp_nonce_field('dd-form-department-add'); ?>
                <table class="form-table">
                    <tr>
                        <th width="150"><label for="title">Departman Adı</label></th>
                        <td><input name="title" id="title" type="text" required style="width: 100%;"></td>
                    </tr>                    
                    <tr>
                        <?php
                        wp_admin_select_input([
                            'id'           => 'parent_department_id',
                            'label'        => 'Üst Departman',
                            'selected'     => $department->parent_department_id ?? '',
                            'tree'         => true,
                            'options'      => $tree,
                            'first_option' => '— Üst Departman Yok —',  // <-- burası eklendi
                        ]);
                        ?>
                    </tr>
                    <tr>
                        <th><label for="emails">Bilgilendirilecek E-postalar</label></th>
                        <td><input name="emails" id="emails" type="text" style="width: 100%;"></td>
                    </tr>
                </table>
                <p>
                    <button type="submit" name="add_category" class="button button-primary">Yeni Departman Ekle</button>
                </p>                
            </form>
        </div>

        <!-- Sağ: Departman Listesi -->
        <div style="flex:2;">
            <h2>Mevcut Departmanlar</h2>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Adı</th>                        
                        <th>Epostalar</th>
                        <th>Üst Departman</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (!empty($departments)) : ?>
                        <?php dd_render_department_rows(0, $tree, $dept_map); ?>
                    <?php else : ?>
                    <tr><td colspan="5">Hiç departman bulunamadı.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

    </div>
</div>