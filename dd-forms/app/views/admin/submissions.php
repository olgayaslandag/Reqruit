<div class="wrap">
    <h1 class="wp-heading-inline">Başvurular</h1>    

    <div style="float: right;">
        <button class="button" id="toggle-filters">
            Filtreleri Göster
        </button>
    </div>

    <hr class="wp-header-end" style="margin-bottom: 1rem;">

    <div id="filter-panel" style="display:none; margin-top: 1rem; margin-bottom: 1rem;">
        <form method="get">
            <input type="hidden" name="page" value="dd-form-submissions">
            <table>
                <tr>
                    <th style="text-align: left;">Tarih</th>
                    <td>
                        <input type="date" name="date_from" value="<?php echo isset($_GET['date_from']) ? $_GET['date_from'] : ''; ?>">
                        <input type="date" name="date_to" value="<?php echo isset($_GET['date_to']) ? $_GET['date_to'] : ''; ?>">
                    </td>
                </tr>

                <tr>
                    <th style="text-align: left;">Departman</th>
                    <td>
                        <select name="department">
                            <option value="">Tümü</option>
                            <?php foreach($departments ?? [] as $department){?>
                            <option value="<?php echo $department->id; ?>" <?php echo isset($_GET['department']) && $department->id == $_GET['department'] ? 'selected' : ''; ?>>
                                <?php echo $department->title; ?>
                            </option>
                            <?php } ?>
                        </select>
                    </td>
                </tr>

                <tr>
                    <th style="text-align: left;">Form</th>
                    <td>
                        <select name="form">
                            <option value="">Tümü</option>
                            <?php foreach($forms ?? [] as $form){?>
                            <option value="<?php echo $form->id; ?>" <?php echo isset($_GET['form']) && $form->id == $_GET['form'] ? 'selected' : ''; ?>>
                                <?php echo $form->name; ?>
                            </option>
                            <?php } ?>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th></th>
                    <td>
                        <button class="button button-primary">Filtrele</button>
                    </td>
            </table>
        </form>
    </div>

    <table class="wp-list-table widefat fixed striped table-view-list" id="myTable">
        <thead>
            <tr>
                <th width="30"></th>
                <th>Ad Soyad</th>
                <th>Tarih</th>            
                <th>Form Adı</th>
                <th>Departman</th>
                <th width="100">Yorumlar</th>
                <th width="110">Puan</th>                
            </tr>
        </thead>
        <tbody>
            <?php foreach($submissions ?? [] as $sub){?>
            <tr id="<?php echo $sub->id; ?>">
                <td>
                    <strong>
                        <a href="<?= $sub->prev_url; ?>">
                            #<?= $sub->id; ?>
                        </a>
                    </strong>
                </td>
                <td>                    
                    <strong>
                        <a href="<?= $sub->prev_url; ?>">                            
                            <?= $sub->person_name ?? '-'; ?>
                        </a>
                    </strong>
                    <div class="row-actions">
                        <span><a href="<?= $sub->prev_url; ?>">Detaylar</a></span>
                        <span class="trash" style="display: none;">
                             | <a href="<?= $sub->delete_url; ?>">Çöp</a>
                        </span>                    
                    </div>
                </td>
                <td><?php echo $sub->created_at; ?></td>
                <td><?php echo $sub->form_name; ?></td>
                <td><?php echo $sub->department_title; ?></td>
                <td><?= $sub->comment_count; ?>
                <td>
                    <?php if ($sub->avg_rating !== null): ?>
                        <?= dd_render_stars($sub->avg_rating); ?>
                    <?php else: ?>
                        —
                    <?php endif; ?>
                </td>
            </tr>
            <?php } ?>
        </tbody>
    </table>
</div>



<script>
jQuery(function ($) {
    const $btn = $('#toggle-filters');
    const $panel = $('#filter-panel');

    $btn.on('click', function () {
        $panel.slideToggle(200, function () {
            if ($panel.is(':visible')) {
                $btn.text('Filtreleri Gizle');
            } else {
                $btn.text('Filtreleri Göster');
            }
        });
    });
});
</script>