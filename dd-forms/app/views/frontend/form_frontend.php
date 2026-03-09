<?php
$token = $_GET['dd_form_token'] ?? null;
$form_message = null;

if ($token) {
    // Kaydedilmiş token'ı çek
    $data = get_transient("dd_form_token_$token");

    if ($data) {
        // Mesaj gösterilecek veri burada
        $form_message = $data;

        // Token tek kullanımlık olsun diye hemen silelim
        delete_transient("dd_form_token_$token");
    }
}
?>

<?php if ($form_message): ?>

    <?php if ($form_message['status'] === 'success'): ?>
        <div class="alert alert-success">Form başarıyla gönderildi.</div>

    <?php elseif ($form_message['status'] === 'error'): ?>
        <div class="alert alert-danger">
            Hata: <?php echo esc_html($form_message['msg']); ?>
        </div>
    <?php endif; ?>

<?php else: ?>


    
    <!-- Token yoksa normal içerik -->
    <?php if (!empty($departments)): ?>
        <ul class="dd-department-list">
            <?php foreach ($departments as $dep): ?>
                <li>
                    <a href="<?php echo esc_url(add_query_arg(['dd_dep' => $dep->id])); ?>">
                        <?php echo esc_html($dep->title); ?>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>

    <?php else: ?>
        <?php if (!$form): ?>
            <p>Bu departmana ait form bulunamadı.</p>
        <?php else: ?>
            <?php echo dd_render_form_frontend($form); ?>
        <?php endif; ?>
    <?php endif; ?>

<?php endif; ?>