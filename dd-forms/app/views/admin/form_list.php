<div class="wrap">
    <h1 class="wp-heading-inline">Formlar</h1>
    <a href="<?php echo admin_url('admin.php?page=dd-form-add'); ?>" class="page-title-action">Yeni ekle</a>

    
    <hr class="wp-header-end" style="margin-bottom: 1rem;">
    
    

    <table class="wp-list-table widefat fixed striped table-view-list" id="myTable">
    <thead>
        <tr>
            <th>Başlık</th>            
            <th>Departman</th>
            <th>E-Postalar</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach($forms ?? [] as $form){?>
        <tr id="<?php echo $form->id; ?>">
            <td>
                <strong>
                    <a href="<?= $form->edit_url; ?>"><?php echo $form->name; ?></a>
                </strong>
                <div class="row-actions">
                    <span><a href="<?= $form->edit_url; ?>">Düzenle</a> | </span>
                    <span class="trash">
                        <a href="<?= $form->delete_url; ?>">Çöp</a>
                    </span>                    
                </div>
            </td>
            <td>
                <?php echo $form->department_title; ?>
            </td>
            <td>
                <?php echo $form->department_emails; ?>
            </td>
        </tr>
        <?php } ?>
    </tbody>
    </table>
</div>