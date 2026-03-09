<div class="wrap">
    <h1 class="wp-heading-inline">
        Başvuru Detayı 
        <span>#<?= $submission->id; ?></span>
    </h1>

    <hr class="wp-header-end" style="margin-bottom: 1rem;">
    <div style="float: left;">
        <h2>
        <?= $submission->name; ?> 
            <i style="font-weight: 300;">(<?= $submission->title; ?>)</i>
        </h2>
        <p><?= $submission->created_at; ?></p>
    </div>

    <div style="float: right;">
        <a href="<?php echo admin_url('admin-post.php?action=download_submission_pdf&submission_id=' . $submission_id); ?>" class="button button-primary" style="display: none;">
            PDF Olarak İndir
        </a>
    </div>

    <table class="wp-list-table widefat fixed striped table-view-list" id="myTable">
        <tbody>
            <?php foreach($details as $name => $item){ ?>
            <tr>
                <th style="font-weight: bold; width: 300px;">
                    <?= esc_html($item['label']); ?>
                </th>
                <td>
                    <?= esc_html($item['value']); ?>
                </td>
            </tr>
            <?php } ?>
        </tbody>
    </table>


    <div style="margin-top: 5rem;">
        <h2>Yorumlar</h2>
        
        <?php foreach($comments as $com) { ?>
            <table class="wp-list-table widefat fixed table-view-list dd-card">
                <tbody>
                    <tr>
                        <td class="dd-card-content">
                            <p><?= esc_html($com->comment); ?></p>
                        </td>
                    </tr>
                    <tr>
                        <td class="dd-card-footer">
                            <span class="dd-author">
                                <span class="dashicons dashicons-admin-users"></span>
                                <?= esc_html($com->display_name); ?>
                            </span>

                            <span class="dd-rating">
                                <?php
                                $rating = intval($com->rating);
                                $max = 5;

                                for ($i = 1; $i <= $max; $i++) {
                                    if ($i <= $rating) {
                                        echo '<span class="dashicons dashicons-star-filled"></span>';
                                    } else {
                                        echo '<span class="dashicons dashicons-star-empty"></span>';
                                    }
                                }
                                ?>
                            </span>

                            <span class="dd-date">
                                <span class="dashicons dashicons-clock"></span>
                                <?= date('Y-m-d H:i', strtotime($com->created_at)); ?>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        <?php } ?>


        <form method="post" action="<?= admin_url('admin-post.php'); ?>">
            <input type="hidden" name="action" value="dd_comment_post">

            <textarea name="comment" required style="width:100%;height:100px;"></textarea>

            <select name="rating" required>
                <option value="">Puan yok</option>
                <option value="5">★★★★★</option>
                <option value="4">★★★★☆</option>
                <option value="3">★★★☆☆</option>
                <option value="2">★★☆☆☆</option>
                <option value="1">★☆☆☆☆</option>
            </select>

            <input type="hidden" name="submission_id" value="<?= esc_attr($submission->id); ?>">

            <?php wp_nonce_field('dd_add_comment'); ?>

            <button class="button button-primary">Yorum Ekle</button>
        </form>
    </div>
</div>



<style>
    .dd-card {
        margin-bottom: 16px;
        border-radius: 6px;
        overflow: hidden;
    }

    .dd-card-content {
        padding: 14px 16px;
        font-size: 14px;
        line-height: 1.6;
        color: #1d2327;
        background: #fff;
    }

    .dd-card-content p {
        margin: 0;
    }

    .dd-card-footer {
        padding: 10px 16px;
        background: #f6f7f7;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
    }

    .dd-author {
        font-weight: 600;
        color: #1d2327;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .dd-date {
        font-weight: 400;
        color: #646970;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .dd-card-footer .dashicons {
        font-size: 16px;
        line-height: 1;
        color: #646970;
    }

    .dd-card {
        transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .dd-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transform: translateY(-2px);
    }

    .dd-author .dashicons {
        color: #2271b1;
    }

    .dd-card-content {
        /*max-width: 900px;*/
    }
</style>