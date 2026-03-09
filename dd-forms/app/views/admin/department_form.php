<div class="wrap">
    <h1>Departman Formu</h1>
    <p>Burada departman detaylarını düzenleyebilirsiniz.</p>


    <form action="<?php echo admin_url('admin.php?page=dd-form-departments-post'); ?>" method="post">
        <?php wp_nonce_field('dd-form-department-add'); ?>
        <table class="form-table">
            <tr>
                <?php
                    wp_admin_text_input([
                        'id'    => 'title',
                        'label' => 'Departman Adı',
                        'value' => old('title', $department->title ?? ''),
                        'desc'  => ''
                    ]);
                ?>
            </tr>                    
            <tr>
                <?php 
                list($tree, $dept_map) = dd_build_department_tree($departments);

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
                <?php
                    wp_admin_text_input([
                        'id'    => 'emails',
                        'label' => 'Bilgilendirilecek E-postalar',
                        'value' => old('emails', $department->emails ?? ''),
                        'desc'  => 'Virgülle ayırın.'
                    ]);
                ?>
            </tr>
        </table>
        <p>
            <a href="<?= admin_url('admin.php?page=dd-form-departments'); ?>" class="button">Geri</a>
            <button type="submit" name="add_category" class="button button-primary">Kaydet</button>
        </p>                
        <input type="hidden" name="id" value="<?= $department->id ?? ''; ?>">
    </form>
</div>